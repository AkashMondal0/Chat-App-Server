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
    admins: {
        type: Array,
        ref: "User",
        default: []
    },
    members: {
        type: [
            {
                role: {
                    type: String,
                    enum: ["admin", "member", "co-admin"],
                    default: "member"
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
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
        type: Array,
        ref: "Group-Message",
        default: []
    },
}, { timestamps: true });


export default mongoose.model("Group-Conversation", GroupSchema);