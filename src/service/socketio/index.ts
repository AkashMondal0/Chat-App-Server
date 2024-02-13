import { Server } from "socket.io";
import redisConnection from "../../db/redis-connection";
import { pub } from "../redis";

export const socketIO = new Server({
    cors: {
        origin: true
    }
})

// socket io
socketIO.on('connection', (socket) => {
    // user --------------------------------------

    socket.on('user_connect', async (user) => {
        try {
            socket.join(user.id);
            // save user id to redis
            const authorId = `status:${socket.id}`
            await redisConnection.set(authorId, user.id, 'EX', 60 * 60 * 2);
            await pub.publish("userStatus", JSON.stringify({ userId: user.id, status: true }));
        } catch (error) {
            console.log(error)
        }
    });

    socket.on('disconnect', async () => {
        try {
            // socket.id ==> redis find user id and set status to false delete user id from redis
            const authorId = `status:${socket.id}`
            const user = await redisConnection.get(authorId);
            await redisConnection.del(`userLogin:${user}`);
            await redisConnection.del(authorId);
            await pub.publish("userStatus", JSON.stringify({ userId: user, status: false }));
        } catch (error) {
            console.log(error)
        }
    });

    // user chat list -------------------------------
    socket.on('update_Chat_List_Sender', async (_data) => {
        await pub.publish("update_Chat_List", JSON.stringify(_data));
    });

    // message --------------------------------------
    socket.on('message_sender', async (_data) => {
        await pub.publish("message", JSON.stringify(_data));
        // await saveMessageInDB(_data) //TODO kafka producer
    });

    socket.on('message_seen_sender', async (_data) => {
        await pub.publish("message_seen", JSON.stringify(_data));
        // await saveMessageSeenInDB(_data) //TODO kafka producer
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

    // qr code --------------------------------------

    socket.on('qr_code_sender', async (data) => {
        await pub.publish("qr_code_receiver", JSON.stringify(data));
    });

});
