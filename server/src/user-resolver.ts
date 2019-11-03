import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware } from 'type-graphql';
import argon2, { argon2id } from 'argon2'

import { UserModel, User } from './models/User';
import { ApolloContext } from './interfaces/apollo-context.interface';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';
import { sendRefreshToken } from './send-refresh-token';
import { ObjectIdScalar } from './scalars/object-id-scalar';
import { Types } from 'mongoose';
import { verify } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolvers {
  /**
   * types to return is a String
   */
  @Query(() => String)
  hello () {
    return 'hi!'
  }

  /**
   * this query is only
   * for authenticated user
   * using a useMiddleware to validate request
   */
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(
    @Ctx() { payload }: ApolloContext
  ) {
    console.log(payload);
    return `your user id is ${payload!.userId}`
  }

  /**
   * Get all users
   */
  @Query(() => [ User ])
  async users() {
    return await UserModel.find();
  }

  /**
   * Get specific user by access token
   * using the userId
   * @param context: Object
   */
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() context: ApolloContext
  ) {
    const { authorization } = context.req.headers;

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      context.payload = payload;
      return await UserModel.findById(payload.userId);
    } catch(err) {
      console.log('Error', err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokenForUser(
    @Arg('userId', () => ObjectIdScalar) userId: Types.ObjectId
  ) {
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc : { tokenVersion: 1 }
      },
      { new: true }
    );

    return true
  }

  /**
   * Register Mutation
   * @param email: string
   * @param password: string
   */
  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<boolean> {

    const hashPassword = await argon2.hash(password, { type: argon2id});

    const newUser = await UserModel.create({
      email,
      password: hashPassword
    });

    if (!newUser) {
      return false;
    }

    return true;
  }

  /**
   * Register Mutation
   * @param email: string
   * @param password: string
   */
  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: ApolloContext
  ): Promise<LoginResponse> {

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('Invalid username or password. user');
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      throw new Error('Invalid username or password. password');
    }

    /**
     * Login Sucessfully
     * create refresh token
     * and send access token
     */

    sendRefreshToken(res, await createRefreshToken(user));

    return {
      accessToken: await createAccessToken(user),
      user
    };
  }

  @Mutation(() => Boolean)
  async logout(
    @Ctx() {res}: ApolloContext
  ) {
    sendRefreshToken(res, '');

    return true;
  }
}