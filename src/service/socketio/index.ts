import { Server } from "socket.io";
import redisConnection from "../../db/redis-connection";
import { findUserSocketId, pub } from "../redis";
import { produceMessage, produceMessageSeen } from "../../kafka";

export const socketIO = new Server({
    cors: {
        origin: true
    }
})

// socket io
socketIO.on('connection', (socket) => {
    // user --------------------------------------

    socket.on('user_connect', async (data) => {
        try {
            const authorIdKey = `userLogin:${data.user?._id}`
            await redisConnection.set(authorIdKey, JSON.stringify({
                socketId: data.socketId,
                userData: data.user,
                isOnline: true
            }), "EX", 60 * 60)
        } catch (error) {
            console.log(error)
        }
    });

    socket.on('disconnect', async () => {
        try {
            // // socket.id ==> redis find user id and set status to false delete user id from redis
            // const authorId = `status:${socket.id}`
            // const user = await redisConnection.get(authorId);
            // await redisConnection.del(`userLogin:${user}`);
            // await redisConnection.del(authorId);
            // await pub.publish("userStatus", JSON.stringify({ userId: user, status: false }));
        } catch (error) {
            console.log(error)
        }
    });

    // user chat list -------------------------------
    socket.on('update_Chat_List_Sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        if (userSocketId) {
            const data = {
                ..._data,
                receiverId: userSocketId
            }
            await pub.publish("update_Chat_List", JSON.stringify(data));
        }
    });

    // message --------------------------------------
    socket.on('message_sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        const data = {
            ..._data,
            receiverId: userSocketId
        }
        const stringify = JSON.stringify(data)
        if (userSocketId) {
            pub.publish("message", stringify);
        }
        produceMessage(stringify)
    });

    socket.on('message_seen_sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        const data = {
            ..._data,
            receiverId: userSocketId
        }
        const stringify = JSON.stringify(data)
        if (userSocketId) {
            pub.publish("message_seen", stringify);
        }
        produceMessageSeen(stringify)
    });

    // typing --------------------------------------
    socket.on('message_typing_sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        if (userSocketId) {
            const data = {
                ..._data,
                receiverId: userSocketId
            }
            await pub.publish("message_typing", JSON.stringify(data));
        }
    });

    // group --------------------------------------
    //coming soon

    // qr code --------------------------------------

    socket.on('qr_code_sender', async (data) => {
        await pub.publish("qr_code_receiver", JSON.stringify(data));
    });

    // tic tac teo --------------------------------------

    socket.on('incoming_game_request_sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        if (userSocketId) {
            const data = {
                ..._data,
                receiverId: userSocketId
            }
            socket.to(userSocketId).emit('incoming_game_request_receiver', data);
        }
    });
    socket.on('game_request_Answer_sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        if (userSocketId) {
            const data = {
                ..._data,
                receiverId: userSocketId
            }
            socket.to(userSocketId).emit('game_request_Answer_receiver', data);
        }
    });

    socket.on('in_game_sender', async (_data) => {
        const userSocketId = await findUserSocketId(_data.receiverId)
        if (userSocketId) {
            const data = {
                ..._data,
                receiverId: userSocketId
            }
            socket.to(userSocketId).emit('in_game_receiver', data);
        }
    });

    // group call --------------------------------------

    socket.on('group_chat_connection_sender', async (_data) => {
        const { receiverIds } = _data
        receiverIds.forEach(async (receiverId: string) => {
            const userSocketId = await findUserSocketId(receiverId)
            if (userSocketId) {
                const data = {
                    ..._data,
                    receiverId: userSocketId
                }
                socket.to(userSocketId).emit('group_chat_connection_receiver', data);
            }
        })
    })

    socket.on('group_message_sender', async (_data) => {
        const { receiverIds } = _data

        receiverIds.forEach(async (receiverId: string) => {
            const userSocketId = await findUserSocketId(receiverId)
            if (userSocketId) {
                const data = {
                    ..._data,
                    receiverId: userSocketId
                }
                socket.to(userSocketId).emit('group_message_receiver', data);
            }
        })
    });
});
