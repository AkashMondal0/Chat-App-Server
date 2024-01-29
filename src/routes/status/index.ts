/* eslint-disable prefer-const */
/* eslint-disable no-inner-declarations */
import express from "express"
import redisConnection from "../../db/redis-connection"
const statusRouter = express.Router()

statusRouter.post("/upload", async (req, res) => {
    try {
        const { _id, status } = req.body
        const authorKey = `userStatus:${_id}`

        for (let i = 0; i < status.length; i++) {
            const element = status[i];
            await redisConnection.lpush(authorKey, JSON.stringify(element))
        }
        return res.status(200).json({ message: "status upload success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

statusRouter.patch("/remove", async (req, res) => {
    try {
        const { _id, status } = req.body
        const authorKey = `userStatus:${_id}`

        for (let i = 0; i < status.length; i++) {
            const element = status[i];
            await redisConnection.lrem(authorKey, 0, JSON.stringify(element))
        }
        return res.status(200).json({ message: "status remove success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

statusRouter.get("/get", async (req, res) => {
    try {
        const _id = req.query._id as string
        const SeenUserId = req.query.SeenUserId as string
        const authorKey = `userStatus:${_id}`
        const caching = await redisConnection.lrange(authorKey, 0, -1)

        let Statuses = []
        for (let i = 0; i < caching.length; i++) {
            const element = caching[i];
            const data = JSON.parse(element)
            Statuses.push(data)
        }

        // for (let i = 0; i < caching.length; i++) {
        //     const element = caching[i];
        //     const data = JSON.parse(element)
        //     if (data._id === _id) {
        //         data.seen = true
        //         await redisConnection.lset(authorKey, i, JSON.stringify(data))
        //     }
        // }
        return res.status(200).json({ message: "status get success", data: Statuses })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

export default statusRouter