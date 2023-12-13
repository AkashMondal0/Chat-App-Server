import express from "express"
import User from "../../model/User"
import ValidateMiddleware from "../../middleware/validate-middleware"
import zodUserSchema from "../../validator/user-validator"
import redisConnection from "../../db/redis-connection"

const userRouter = express.Router()

userRouter.get("/", async (req, res) => {
    const data = await User.find({})
    res.status(200).json(data)
})


userRouter.post("/create", ValidateMiddleware(zodUserSchema), async (req, res) => {
    try {
        const redis_db = await redisConnection.get("todos")
        if (redis_db) {
            console.log("redis")
            res.status(200).json(JSON.parse(redis_db))
        } else {
            redisConnection.set("todos", JSON.stringify({ name: "akash" }), "EX", 10)
            res.status(200).json({ message: "redis" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})


export default userRouter