/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express"
import PrivateConversation from "../../model/Private-Conversation"
// import redisConnection from "../../db/redis-connection"
import jwt from "jsonwebtoken"
import PrivateMessage from "../../model/Private-Message"
import { findUsers } from "../../controller/user"
import { User } from "../../types"
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
            lastMessageContent: "add new friend",
            messages: [],
            userDetails: {}
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

        // user conversation list
        const privateChatList = await PrivateConversation.find({ users: { $in: [userId] } })
            .sort({
                updatedAt: -1
            })
            .exec()

        // user ids list
        const findUserIds = privateChatList?.map((item) => item.users?.filter((_userId) => _userId !== userId)[0]) || []

        // user details list
        const usersDetailsList = await findUsers(findUserIds as string[], userId) as User[]

        const privateChatListWithLastMessage = await Promise.all(privateChatList.map(async (chat) => {
            chat.messages = await PrivateMessage.find({ conversationId: chat._id })
                .sort({ createdAt: -1 })
                .limit(20).exec()
            chat.lastMessageContent = chat?.messages.length > 0 ? chat?.messages[0]?.content : chat.lastMessageContent
            chat.updatedAt = chat?.messages.length > 0 ? chat?.messages[chat?.messages.length - 1]?.createdAt : chat.updatedAt
            chat.userDetails = usersDetailsList?.find((user) => user._id.toString() === chat.users?.filter((_userId) => _userId !== userId)[0])
            return chat
        }))

        res.status(200).json(privateChatListWithLastMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

privateChatRouter.get("/chat/list/messages/:id", async (req, res) => {
    try {
        // url example: http://localhost:5000/api/private/chat/list/messages?page=1&size=10
        const conversationId = req.params.id
        const page = parseInt(req.query.page as any) || 1; // default to page 1
        const size = parseInt(req.query.size as any) || 15; // default to 10 items per page

        // console.log(conversationId, page, size)
        const getMoreMessage = await PrivateMessage.find({ conversationId }).sort({
            createdAt: -1
        })
            .skip((page - 1) * size)
            .limit(size).exec()
        res.status(200).json(getMoreMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

export default privateChatRouter
