import mongoose from "mongoose";
import { PrivateMessage } from "../types";

const PrivateSchema = new mongoose.Schema<PrivateMessage>({
    content: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: [
            {
                url: {
                    type: String,
                    required: true,
                },
                type: {
                    type: {
                        type: String,
                        enum: ["image", "video", "audio", "file"],
                        required: true,
                    },
                    required: true,
                },
            }
        ],
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
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        default: []
    },
    deliveredTo: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        default: []
    }
}, { timestamps: true });


export default mongoose.model("Private-Message", PrivateSchema);