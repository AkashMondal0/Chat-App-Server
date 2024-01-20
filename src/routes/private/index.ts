import express from "express"
import PrivateConversation from "../../model/Private-Conversation"
// import redisConnection from "../../db/redis-connection"
import jwt from "jsonwebtoken"
import PrivateMessage from "../../model/Private-Message"
const secret = process.env.JWT_SECRET
const privateChatRouter = express.Router()

privateChatRouter.post("/chat/connection", async (req, res) => {
    try {
        const { users } = req.body

        if (!users || users.length !== 2) {
            return res.status(400).json({ message: "users is required and must be 2 users" })
        }

        const findPrivateChat = await PrivateConversation.findOne({ users: { $all: users } })

        if (findPrivateChat) {
            return res.status(400).json({ message: "private chat already exist" })
        }

        const createPrivateChat = await PrivateConversation.create({
            users,
            lastMessageContent: "add new friend"
        })
        res.status(200).json(createPrivateChat)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

privateChatRouter.get("/chat/list", async (req, res) => {
    try {
        const token = req.headers["token"] as string
        const { id: userId } = jwt.verify(token, secret as string) as { id: string };

        const privateChatList = await PrivateConversation.find({ users: { $in: [userId] } })
            
        const privateChatListWithLastMessage = await Promise.all(privateChatList.map(async (chat) => {
            chat.messages = await PrivateMessage.find({ conversationId: chat._id })
            // .sort({ createdAt: -1 })
            .limit(20)
            chat.lastMessageContent = chat?.messages.length > 0 ? chat?.messages[chat?.messages.length -1]?.content : chat.lastMessageContent
            chat.updatedAt = chat?.messages.length > 0 ? chat?.messages[chat?.messages.length -1]?.createdAt : chat.updatedAt

            return chat
        }))

        res.status(200).json(privateChatListWithLastMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})


export default privateChatRouter
