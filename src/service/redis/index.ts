import redisConnection from "../../db/redis-connection"
import { produceMessage, produceMessageSeen } from "../../kafka"
import { socketIO } from "../socketio"

// redis pub/sub
export const pub = redisConnection
const sub = redisConnection.duplicate()

sub.subscribe("message")
sub.subscribe("message_seen")
sub.subscribe("message_typing")
sub.subscribe("update_Chat_List")
sub.subscribe("userStatus")
sub.subscribe("qr_code_receiver")

// redis pub/sub
sub.on("message", async (channel, message) => {
    if (channel === "message") {
        // console.log('message', message)
        const { receiverId } = JSON.parse(message)
        socketIO.to(receiverId).emit('message_receiver', JSON.parse(message));
        await produceMessage(message)
    }
    else if (channel === "message_seen") {
        const { receiverId } = JSON.parse(message)
        socketIO.to(receiverId).emit('message_seen_receiver', JSON.parse(message))
        await produceMessageSeen(message)
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

    else if (channel === "userStatus") {
        const { userId, status } = JSON.parse(message)
        socketIO.emit(userId, { userId, status });
    }

    else if (channel === "qr_code_receiver") {
        const { socketId, token } = JSON.parse(message)
        socketIO.to(socketId).emit('qr_code_receiver', { token: token });
    }
})