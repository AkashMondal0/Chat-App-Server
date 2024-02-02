/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable no-inner-declarations */
import express from "express"
import User from "../../model/User"
const statusRouter = express.Router()

statusRouter.post("/upload", async (req, res) => {
    try {
        const { _id, status } = req.body
        const authorData = await User.updateOne({ _id }, {
            $push: {
                status: status.map((item: any) => item)
            }
        })

        return res.status(200).json(authorData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

statusRouter.patch("/remove", async (req, res) => {
    try {
        const { _id, status } = req.body
        const authorData = await User.updateOne({ _id }, {
            $pull: {
                status: status
            }
        })

        return res.status(200).json(authorData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

// statusRouter.post("/get", async (req, res) => {
    // try {
    //     const { _id } = req.body


    //     return res.status(200).json(UsersStatus)
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({ message: "Server Error Please Try Again" })
    // }
// })

export default statusRouter