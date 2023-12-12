import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
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
    groupId: {
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


export default mongoose.model("Group-Message", GroupSchema);