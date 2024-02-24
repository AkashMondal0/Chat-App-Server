import express from "express"
import GroupConversation from "../../model/Group-Conversation"
import { User } from "../../types"
import jwt from "jsonwebtoken"
// import PrivateMessage from "../../model/Private-Message"
const secret = process.env.JWT_SECRET

const GroupConversationRouter = express.Router()

GroupConversationRouter.post("/chat/connection", async (req, res) => {
    try {
        const { users,
            name,
            description,
            authorId,
        } = req.body

        if (users.length <= 2 || !users) {
            return res.status(400).json({ message: "users is required and must be 2 users" })
        }

        const createGroupConversation = await GroupConversation.create({
            name,
            description,
            members: users.map((userId: User) => ({ userId, role: userId === authorId ? "admin" : "member" })),
            messages: [],
            lastMessageContent: "This group is created by " + authorId,
            createdBy: authorId,
        })
        res.status(200).json(createGroupConversation)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

GroupConversationRouter.get("/chat/list", async (req, res) => {
    try {
        const token = req.headers["token"] as string
        const { id: userId } = jwt.verify(token, secret as string) as { id: string };

        let groupChatList = await GroupConversation.find({ users: { $nin: [userId] } })

        groupChatList = await Promise.all(groupChatList.map(async (chat) => {
            // chat.messages = await PrivateMessage.find({ conversationId: chat._id })
            //     .sort({ createdAt: -1 })
            //     .limit(20).exec()
            chat.lastMessageContent = chat?.messages && chat?.messages.length > 0 ? chat?.messages[0]?.content : chat.lastMessageContent
            // chat.updatedAt = chat?.messages && chat?.messages.length > 0 ? chat?.messages[chat?.messages.length - 1]?.createdAt : chat.updatedAt
            return chat
        }))

        res.status(200).json({
            groupChatList
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

export default GroupConversationRouter