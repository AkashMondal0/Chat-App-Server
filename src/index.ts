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
import redisConnection from './db/redis-connection';
import { saveMessageInDB, saveMessageSeenInDB } from './controller/privateMessage';
import statusRouter from './routes/status';
import profileRouter from './routes/profile';

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
app.use("/PrivateMessage", PrivateChatMessageRoute)
app.use("/status", statusRouter)
app.use("/profile", profileRouter)


app.get('/', (req, res) => {
  res.send('react android chat server redis and mongo socket v1.0.0')
})

// redis pub/sub
const pub = redisConnection
const sub = redisConnection.duplicate()

sub.subscribe("message")
sub.subscribe("message_seen")
sub.subscribe("message_typing")
sub.subscribe("update_Chat_List")

socketIO.on('connection', (socket) => {
  // user --------------------------------------

  socket.on('user_connect', (user) => {
    socket.join(user.id);
  });

  // user chat list -------------------------------
  socket.on('update_Chat_List_Sender', async (_data) => {
    await pub.publish("update_Chat_List", JSON.stringify(_data));
  });

  // message --------------------------------------
  socket.on('message_sender', async (_data) => {
    await pub.publish("message", JSON.stringify(_data));
    await saveMessageInDB(_data)
  });

  socket.on('message_seen_sender', async (_data) => {
    await pub.publish("message_seen", JSON.stringify(_data));
    await saveMessageSeenInDB(_data)
  });

  // typing --------------------------------------
  socket.on('message_typing_sender', async (_data) => {
    await pub.publish("message_typing", JSON.stringify(_data));
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


sub.on("message", (channel, message) => {
  if (channel === "message") {
    const { receiverId } = JSON.parse(message)
    socketIO.to(receiverId).emit('message_receiver', JSON.parse(message));
  }
  else if (channel === "message_seen") {
    const { receiverId } = JSON.parse(message)
    socketIO.to(receiverId).emit('message_seen_receiver', JSON.parse(message));
  }
  else if (channel === "message_typing") {
    const { receiverId } = JSON.parse(message)
    socketIO.to(receiverId).emit('message_typing_receiver', JSON.parse(message));
  }
  else if (channel === "update_Chat_List") {
    const { receiverId, senderId } = JSON.parse(message)
    socketIO.to(receiverId).emit('update_Chat_List_Receiver', JSON.parse(message));
    socketIO.to(senderId).emit('update_Chat_List_Receiver', JSON.parse(message));
  }

  else if (channel === "message_typing_sender") {
    const { receiverId } = JSON.parse(message)
    socketIO.to(receiverId).emit('message_typing_receiver', JSON.parse(message));
  }
})



httpServer.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000`)
});
