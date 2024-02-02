import mongoose from "mongoose";
import { PrivateMessage } from "../types";

const PrivateMessageSchema = new mongoose.Schema<PrivateMessage>({
    _id: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: mongoose.Schema.Types.Array,
        required: false,
        default: [],
    },
    memberId: {
        type: String,
        required: true,
    },
    conversationId: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    seenBy: {
        type: [String],
        default: []
    },
    deliveredTo: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });


export default mongoose.model("Private-Message", PrivateMessageSchema);