import express from "express"
// import ValidateMiddleware from "../../middleware/validate-middleware"
import PrivateConversation from "../../model/Private-Conversation"
import redisConnection from "../../db/redis-connection"

const privateChatRouter = express.Router()

privateChatRouter.post("/chat/connection", async (req, res) => {
    try {
        const { users } = req.body
        const createPrivateChat = await PrivateConversation.create({ users, lastMessageContent: "add new friend" })
        res.status(200).json(createPrivateChat)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})

privateChatRouter.get("/chat/list/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const redis_db_cache = await redisConnection.get(userId)

        if (redis_db_cache) {
            // console.log("redis")
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

privateChatRouter.post("/chat/message/:id", async (req, res) => {
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

export default privateChatRouter
