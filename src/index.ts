/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import env from 'dotenv';
// import helmet from 'helmet';
// import morgan from 'morgan';
import { createServer } from 'http';
import mongodbConnection from './db/mongo-connection';
import userRouter from './routes/user';
import privateChatRouter from './routes/private';
import AuthRouter from './routes/auth';
import PrivateChatMessageRoute from './routes/private/chat';
import statusRouter from './routes/status';
import profileRouter from './routes/profile';
// import responseTime from 'response-time';
// import { client, httpRequestDurationMicroseconds, totalRequestCounter } from './grafana/prometheus';
// import logger from './grafana/loki';
import { socketIO } from './service/socketio';
// import { StartKafka } from './kafka';
import GroupConversationRouter from './routes/group';
import { CronJob } from 'cron';


env.config();
// for express
const app = express();
const PORT = process.env.PORT || 4000;
const APP_VERSION = process.env.APP_VERSION || 'v0.0.0';
const APP_NAME = process.env.APP_NAME || 'sky-chat';
export const httpServer = createServer(app);




// app.use(responseTime((req, res, time) => {
//   httpRequestDurationMicroseconds
//     .labels({
//       method: req.method,
//       route: req.url,
//       statusCode: res.statusCode
//     }).observe(time);
//   totalRequestCounter.inc({
//     method: req.method,
//     route: req.url,
//     statusCode: res.statusCode
//   });
// }))
app.use(cors());
app.use(express.json());
// app.use(helmet({
//   crossOriginEmbedderPolicy: false,
//   contentSecurityPolicy: {
//     directives: {
//       imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
//       scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
//       manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
//       frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
//     },
//   },
// }));
// app.use(morgan('common'));
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/private", privateChatRouter);
app.use("/auth", AuthRouter)
app.use("/PrivateMessage", PrivateChatMessageRoute)
app.use("/groupConversation", GroupConversationRouter)
app.use("/status", statusRouter)
// app.use("/graphql", expressMiddleware(server));


// start service
mongodbConnection()
socketIO.listen(httpServer)
// StartKafka()
// await server.start();


app.get('/', (req, res) => {
  res.send(`Welcome to ${APP_NAME} ${APP_VERSION}`);
})

app.get('/checkServer', (req, res) => {
  console.log('checkServer hit💘💘💘💘💘')
  res.json({
    code: 1,
    status: 'success',
  })
})

setInterval(() => {
  fetch('http://localhost:4000/checkServer')
}, 840000) // 14 minutes

// app.get('/metrics', async (req, res) => {
//   res.setHeader('Content-Type', client.register.contentType);
//   const metrics = await client.register.metrics();
//   res.send(metrics);
// })


httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
});
