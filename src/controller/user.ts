import redisConnection from "../db/redis-connection"
import User from "../model/User"

const findUsers = async (userIds: string[], authorId: string) => {
    try {
        // const authorIdKey = `userList:${authorId}`
        // const caching = await redisConnection.get(authorIdKey)
        const newQuery = async () => {
            const privateChatList = await User.find({ _id: { $in: userIds } })
            // await redisConnection.set(authorIdKey, JSON.stringify(privateChatList), "EX", 60 * 60 * 24 * 1)
            return privateChatList
        }

        // if (caching) {
        //     const caching2 = JSON.parse(caching)

        //     if (caching2.length === userIds?.length) {
        //         console.log("caching user list")
        //         return caching2
        //     } else {
        //        return newQuery()
        //     }
        // } else {
        //    return newQuery()
        // }
        return newQuery()

    } catch (error) {
        console.log(error)
        return []
    }
}

export {
    findUsers
}