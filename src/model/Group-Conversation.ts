import mongoose from "mongoose";
import { GroupChat } from "../types";

const GroupSchema = new mongoose.Schema<GroupChat>({
    name: {
        type: String,
        max: 50,
        required: true,
    },
    description: {
        type: String,
        max: 50,
    },
    picture: {
        type: String,
        required: false,
    },
    members: {
        type: [
            {
                role: {
                    type: String,
                    enum: ["admin", "member", "co-admin"],
                    default: "member"
                },
                userId: {
                    type: mongoose.Schema.Types.String,
                    ref: "User",
                    required: true,
                }
            }
        ],
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
    createdBy: {
        type: mongoose.Schema.Types.String,
        required: true,
    }
}, { timestamps: true });


export default mongoose.model("Group-Conversation", GroupSchema);