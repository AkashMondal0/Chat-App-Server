/* eslint-disable @typescript-eslint/no-unused-vars */
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import env from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import typeDefs from './graphql/typeDefs';
// import resolvers from './graphql/resolvers';
import mongodbConnection from './db/mongo-connection';
import userRouter from './routes/user';
import privateChatRouter from './routes/private';
import AuthRouter from './routes/auth';
import PrivateChatMessageRoute from './routes/private/chat';

env.config();

const app = express();
const httpServer = createServer(app);
const socketIO = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});


// const server = new ApolloServer({ typeDefs, resolvers });
app.use(cors());
app.use(express.json());
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
mongodbConnection
// await server.start();


// app.use("/graphql", expressMiddleware(server));

app.use("/user", userRouter);
app.use("/private", privateChatRouter);
app.use("/auth", AuthRouter)
app.use("/PrivateChat", PrivateChatMessageRoute)

app.get('/', (req, res) => {
  res.send('react android chat server')
})

socketIO.on('connection', (socket) => {

  // user --------------------------------------
  socket.on('user_connect', (user) => {
    socket.join(user.id);
    console.log('user connected', user)
  });

  socket.on('user_disconnect', (user) => {
    // console.log('user disconnected', user)
    socket.leave(user.id);
  });

  // user chat list -------------------------------
  socket.on('user_chat_list', (_data) => {
    const { receiverId, senderId, data } = _data;

    socket.join(receiverId);
    socket.join(senderId);
    socketIO.to(senderId).emit('user_chat_list', data);
    socketIO.to(receiverId).emit('user_chat_list', data);
  });

  // message --------------------------------------
  socket.on('message_for_user', (_data) => {
    const { receiverId, senderId } = _data;
    socket.join(receiverId);
    socketIO.to(receiverId).emit('message_for_user', _data);
  });

  socket.on('message_for_user_seen', (_data) => {
    const { receiverId } = _data;
    socket.join(receiverId);
    socketIO.to(receiverId).emit('message_for_user_seen', _data);

  });

  // typing --------------------------------------
  socket.on('_typing', (_data) => {
    const { receiverId, senderId, conversationId, typing } = _data;
    socket.join(receiverId);
    socketIO.to(receiverId).emit('_typing', _data);
  });

  // group --------------------------------------
  socket.on('user_connect_group', (group) => {
    socket.join(group.id);
  });

  socket.on('group_message_for_user', (group) => {
    socket.join(group.id);
    socketIO.to(group.id).emit('group_message_for_user', group.data);
  });

  socket.on('group_message_for_user_seen', (group) => {
    socket.join(group.groupId);
    socketIO.to(group.groupId).emit('group_message_for_user_seen', group);
  });

  // typing group --------------------------------------
  socket.on('group_typing', (_data) => {
    const { groupId } = _data;
    socket.join(groupId);
    socketIO.to(groupId).emit('group_typing', _data);
  });

  // user chat list -------------------------------
  socket.on('group_chat_list', (_data) => {
    const { senderId, data } = _data;

    socketIO.to(senderId).emit('group_chat_list', data);
  });

});


httpServer.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000`)
});
