import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  
}, { timestamps: true });


export default mongoose.model("Notification-Conversation", NotificationSchema);