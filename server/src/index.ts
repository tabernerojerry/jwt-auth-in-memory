import 'dotenv/config';
import 'reflect-metadata';
import express, { Response, Request } from 'express';
import { connect } from 'mongoose'
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import cors from 'cors';

import { UserResolvers } from './user-resolver';
import { ApolloContext } from './interfaces/apollo-context.interface';
import { UserModel } from './models/User';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshToken } from './send-refresh-token';

(async () =>  {
    await connect(process.env.MONGODB_URL!, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    const app = express();
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(cookieParser());

    app.get('/', (_req, res) => res.send('Hello'));

    // Refresh token route
    app.post('/refresh-token', async (req: Request, res: Response) => {
        console.log(req.cookies);

        const token = req.cookies.jid;

        if (!token) {
            return res.json({ success: false, accessToken: '' });
        }

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch(err) {
            console.log('Error', err);
            return res.json({ success: false, accessToken: '' });
        }

        /**
         * token is valid and
         * we can send back an access token
         */
        const user = await UserModel.findOne({ _id : payload.userId });

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            return res.json({ success: false, accessToken: '' });
        }

        sendRefreshToken(res, await createRefreshToken(user));

        return res.json({ success: true, accessToken: await createAccessToken(user) });
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolvers]
        }),
        context: ({ req, res }: ApolloContext) => ({ req, res })
    })

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(5000, () => console.log('express is running...'))
})();