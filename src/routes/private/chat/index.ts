import express from "express"
import PrivateConversation from "../../../model/Private-Conversation"
const PrivateChatMessageRoute = express.Router()

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

export default PrivateChatMessageRoute