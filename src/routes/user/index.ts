import express from "express"
import User from "../../model/User"
import ValidateMiddleware from "../../middleware/validate-middleware"
import zodUserSchema from "../../validator/user-validator"

const userRouter = express.Router()

userRouter.get("/", async (req, res) => {
    const data = await User.find({})
    res.status(200).json(data)
})


userRouter.post("/create", ValidateMiddleware(zodUserSchema), async (req, res) => {
    try {
        const { username, email, password } = req.body
        const createUser = await User.create({ email, username, password })
        res.status(200).json(createUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
})


export default userRouter