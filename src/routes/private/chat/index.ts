import express from "express"
import PrivateMessage from "../../../model/Private-Message";
import { User } from "../../../types";
const PrivateChatMessageRoute = express.Router()
export interface PrivateMessageSeen {
    messageIds: string[];
    memberId: string;
    receiverId: string;
    conversationId: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface privateMessage {
    _id?: string;
    memberDetails?: User;
    content: string;
    fileUrl?: File[];
    memberId: string;
    senderId: string;
    receiverId: string;
    conversationId: string;
    deleted: boolean;
    seenBy: [User['_id']];
    deliveredTo?: [User['_id']];
    createdAt: string | Date;
    updatedAt: string | Date;
    replyTo?: {
        _id: string;
        content: string;
        memberId: string;
        conversationId: string;
        deleted: boolean;
        replyContent: privateMessage;
    };
}
PrivateChatMessageRoute.post("/send", async (req, res) => {
    try {
        // const _id = req.params.id
        const { message } = req.body as { message: privateMessage } // remove _id from message object
        

        const CreateNewMessage = await PrivateMessage.create(message)
        res.status(200).json(CreateNewMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

PrivateChatMessageRoute.post("/seen", async (req, res) => {
    try {
        // const _id = req.params.id
        const { messages } = req.body as { messages: PrivateMessageSeen }
       const updateMessageSeen = await PrivateMessage.updateMany({ _id: messages.messageIds }, {
            $push: {
                seenBy: messages.memberId
            },
        })
        res.status(200).json(updateMessageSeen)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})



export default PrivateChatMessageRoute