import express from "express"
import User from "../../model/User"

const userRouter = express.Router()

userRouter.get("/search/:userKeyword", async (req, res) => {
    try {
        const searchUsers = await User.find({
            $or: [
                { username: { $regex: req.params.userKeyword, $options: "i" } },
                { email: { $regex: req.params.userKeyword, $options: "i" } },
            ],
        }).limit(8).sort({ username: 1 }).select({ username: 1, email: 1 })
        res.status(200).json(searchUsers)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})

userRouter.post("/users", async (req, res) => {
    try {
        const { users } = req.body as { users: string[] }
        const privateChatList = await User.find({ _id: { $in: users } })
        res.status(200).json(privateChatList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})


export default userRouter