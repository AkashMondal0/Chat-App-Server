import express from "express"
import PrivateConversation from "../../../model/Private-Conversation"
const PrivateChatMessageRoute = express.Router()
interface PrivateMessageSeen {
    messageIds: string[];
    memberId: string;
    receiverId: string;
    conversationId: string;
    createdAt?: string;
    updatedAt?: string;
}
PrivateChatMessageRoute.post("/message/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const { messages } = req.body
        const privateChatList = await PrivateConversation.updateOne({ _id }, {
            $set: {
                lastMessageContent: messages.content,
            },
            $push: {
                messages
            }
        })
        res.status(200).json(privateChatList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})


interface PrivateMessageSeen {
    messageIds: string[];
    memberId: string;
    receiverId: string;
    conversationId: string;
    createdAt?: string;
    updatedAt?: string;
}
PrivateChatMessageRoute.post("/messageSeen/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const { seen } = req.body as { seen: PrivateMessageSeen }
        
        const privateChatList = await PrivateConversation.updateMany({ _id }, {
            $push: {
                "messages.$[].seenBy": seen.memberId
            },
        })

        res.status(200).json(privateChatList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})
export default PrivateChatMessageRoute