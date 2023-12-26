/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express"
import User from "../../model/User"
import ValidateMiddleware from "../../middleware/validate-middleware"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import zodUserSchema from "../../validator/user-validator"
const secret = process.env.JWT_SECRET
const AuthRouter = express.Router()
const saltRounds = 10

AuthRouter.get("/login", async (req, res) => {
    try {
        const email = req.headers['email'] as string;
        const password = req.headers['password'] as string;

        if (!email && !password) {
            return res.status(400).json({ message: "email and password is required" })
        }
        const db_user = await User.findOne({ email: email })

        if (!db_user) {
            return res.status(401).json({ message: "email not found" })
        }

        const checkPassword = await bcrypt.compare(password, db_user.password)

        if (!checkPassword) {
            return res.status(401).json({ message: "invalid credential" })
        }

        const token = jwt.sign({ id: db_user.id }, secret as string)

        return res.status(200).json({ token })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: error?.message })
    }
})


AuthRouter.post("/register", ValidateMiddleware(zodUserSchema), async (req, res) => {
    try {
        const data = req.body
        if (!data.email && !data.password) {
            return res.status(400).json({ message: "email and password is required" })
        }

        const alreadyUser = await User.findOne({ email: data.email })

        if (alreadyUser) {
            return res.status(401).json({ message: "user already exist" })
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(data.password, salt);

        const newUser = await User.create({
            email: data.email,
            password: hash,
            username: data.username,
        })

        const token = jwt.sign({ id: newUser.id }, secret as string)

        return res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
})

AuthRouter.get("/authorization", async (req, res) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(404).json({ message: "Token not found" })
        }

        const verify = jwt.verify(token, secret as string) as { id: string };

        if (!verify?.id) {
            return res.status(404).json({ message: "Invalid token" })
        }

        const user = await User.findById(verify.id)

        return res.status(200).json(user)
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
})

export default AuthRouter