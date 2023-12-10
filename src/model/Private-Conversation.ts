import mongoose from "mongoose";

const PrivateSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    user:{
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
    },
    messageCount: {
        type: Number,
        index: true,
        required: true,
    },
}, { timestamps: true });


export default mongoose.model("Private-Conversation", PrivateSchema);