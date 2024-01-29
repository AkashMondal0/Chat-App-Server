/* eslint-disable prefer-const */
/* eslint-disable no-inner-declarations */
import express from "express"
import redisConnection from "../../db/redis-connection"
const statusRouter = express.Router()

statusRouter.post("/upload", async (req, res) => {
    try {
        const { _id, status } = req.body
        // console.log(req.body)
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

statusRouter.post("/get", async (req, res) => {
    try {
        const _ids = req.body._ids
        // const SeenUserId = req.body.profileId
        let UsersStatus = []

        for (let i = 0; i < _ids.length; i++) {
            const authorKey = `userStatus:${_ids[i]}`
            const caching = await redisConnection.lrange(authorKey, 0, -1)
            let Statuses = []
            for (let j = 0; j < caching.length; j++) {
                const element = caching[j];
                const data = JSON.parse(element)

                // if (!data.seen.includes(SeenUserId)) {
                //     data.seen.push(SeenUserId)
                //     await redisConnection.lset(authorKey, i, JSON.stringify(data))
                // }
                Statuses.push(data)
            }
            UsersStatus.push({
                userId: _ids[i],
                status: Statuses
            })
        }

        return res.status(200).json(UsersStatus)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error Please Try Again" })
    }
})

export default statusRouter