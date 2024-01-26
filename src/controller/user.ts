import redisConnection from "../db/redis-connection"
import User from "../model/User"

const findUsers = async (userIds: string[], authorId: string) => {
    try {

        const privateChatList = await User.find({ _id: { $in: userIds } })
        // await redisConnection.set(authorIdKey, JSON.stringify(privateChatList), "EX", 60 * 60 * 24 * 1)
        return privateChatList

    }
    catch (error) {
        console.log(error)
        return []
    }
}

export {
    findUsers
}