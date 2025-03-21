import express from "express"
import User from "../../model/User"
import redisConnection from "../../db/redis-connection"


const userRouter = express.Router()

userRouter.get("/search/:userKeyword", async (req, res) => {
    try {
        const searchUsers = await User.find({
            $or: [
                { username: { $regex: req.params.userKeyword, $options: "i" } },
                { email: { $regex: req.params.userKeyword, $options: "i" } },
            ],
        }).limit(8).sort({ username: 1 })
        res.status(200).json(searchUsers)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

userRouter.post("/users", async (req, res) => {
    try {
        // usersList:authorId key value
        const { users, authorId } = req.body as { users: string[], authorId: string }
        const authorIdKey = `userList:${authorId}`
        const caching = await redisConnection.get(authorIdKey)
        
        const newQuery = async () => {
            const privateChatList = await User.find({ _id: { $in: users } })
            await redisConnection.set(authorIdKey, JSON.stringify(privateChatList), "EX", 60 * 60 * 24 * 1)
            res.status(200).json(privateChatList)
        }
        
        if (caching) {
            const caching2 = JSON.parse(caching)
            
            if (caching2.length === users.length) {
                console.log("caching user list")
                return res.status(200).json(caching2)
            } else {
                newQuery()
            }
        } else {
            newQuery()
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})


export default userRouter