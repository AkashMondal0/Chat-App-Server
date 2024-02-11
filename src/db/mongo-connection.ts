/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongodbConnection = () => {
    mongoose.connect(process.env.MONGODB_URI as string, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => {
            console.log(err)
            process.exit(1);
        });
}

export default mongodbConnection;