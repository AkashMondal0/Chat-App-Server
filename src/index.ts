import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import env from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import mongodbConnection from './db/mongo-connection';
import userRouter from './routes/user';
import privateChatRouter from './routes/private';

env.config();


const startServer = async () => {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  }));
  app.use(morgan('common'));
  await mongodbConnection
  await server.start();


  app.use("/graphql", expressMiddleware(server));

  app.use("/user", userRouter);
  app.use("/private", privateChatRouter);


  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000`)
  });
}
startServer();