import mongoose from "mongoose";
import { PrivateChat } from "../types";

const PrivateSchema = new mongoose.Schema<PrivateChat>({
    users:{
        type: mongoose.Schema.Types.Array,
        ref: "User",
        default: []
    },
    lastMessageContent: {
        type: String,
        required: true,
    },
    messages: {
        type: mongoose.Schema.Types.Array,
        ref: "Private-Message",
        default: []
    }
}, { timestamps: true });


export default mongoose.model("Private-Conversation", PrivateSchema);