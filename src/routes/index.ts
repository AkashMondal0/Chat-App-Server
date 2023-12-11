import express from "express"
import ValidateMiddleware from "../middleware/validate-middleware"
import zodUserSchema from "../validator/user-validator"
import User from "../model/User"

const userRouter = express.Router()

userRouter.get("/", async (req, res) => {
    const data = await User.find({})
    res.status(200).json(data)
})


export default userRouter