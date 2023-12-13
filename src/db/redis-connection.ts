import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();
const redisConnection = new Redis(process.env.REDIS_URL as string)

redisConnection.on("connect", () => {
    console.log("Redis connected")
})

redisConnection.on("error", (error) => {
    console.log(error)
    process.exit(1)
})

export default redisConnection;