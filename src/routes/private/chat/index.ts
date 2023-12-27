import express from "express"
import PrivateConversation from "../../../model/Private-Conversation"
const PrivateChatMessageRoute = express.Router()

PrivateChatMessageRoute.post("/chat/message/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const privateChatList = await PrivateConversation.updateOne({ _id }, {
            $set: {
                lastMessageContent: "test update",
            },
            $push: {
                messages: {
                    sender: "test sender",
                    content: "test content",
                    createdAt: new Date(),
                }
            }
        })
        res.status(200).json(privateChatList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})

export default PrivateChatMessageRoute