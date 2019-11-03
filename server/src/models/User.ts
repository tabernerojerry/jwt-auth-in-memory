import { Types } from 'mongoose';
import { Typegoose, prop } from '@hasezoey/typegoose';
import { ObjectType, Field } from 'type-graphql';

import { ObjectIdScalar } from '../scalars/object-id-scalar';

@ObjectType()
export class User extends Typegoose {
  /**
   * display the mongodb _id on the UI as id
   */
  @Field(() => ObjectIdScalar)
  readonly id: Types.ObjectId;

  @Field()
  @prop({
    trim: true,
    unique: true,
    required: true
  })
  public readonly email!: string;

  @prop({
    trim: true,
    required: true
  })
  password!: string;

  @prop({ default: 0 })
  tokenVersion: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const UserModel = new User().getModelForClass(User, {
    schemaOptions: {
      timestamps: true
    }
  }
);
