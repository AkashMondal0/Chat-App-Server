import express from "express"
import User from "../../model/User"

const userRouter = express.Router()

userRouter.get("/", (req, res) => {

    res.send("user router")
})


export default userRouter