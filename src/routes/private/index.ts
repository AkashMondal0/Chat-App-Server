import express from "express"
import PrivateConversation from "../../model/Private-Conversation"
import redisConnection from "../../db/redis-connection"
import jwt from "jsonwebtoken"
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
        res.status(500).json({ message: error })
    }
})

privateChatRouter.get("/chat/list", async (req, res) => {
    try {
        const token = req.headers["token"] as string
        const { id: userId } = jwt.verify(token, secret as string) as { id: string };

        const redis_db_cache = await redisConnection.get(userId)

        if (redis_db_cache) {
            res.status(200).json(JSON.parse(redis_db_cache))
        } else {
            const privateChatList = await PrivateConversation.find({ users: { $in: [userId] } })
            redisConnection.set(userId, JSON.stringify(privateChatList), "EX", 10)
            res.status(200).json(privateChatList)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})


export default privateChatRouter
