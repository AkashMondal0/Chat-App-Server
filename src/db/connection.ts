import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connection = mongoose.connect(process.env.MONGODB_URI as string, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.log(err)
        process.exit(1);
    });

export default connection;