// import PrivateConversation from "../model/Private-Conversation"
import PrivateMessage from "../model/Private-Message"
import { PrivateMessageSeen, privateMessage } from "../routes/private/chat"


const saveMessageInDB = async (message: privateMessage) => {
    try {
        await PrivateMessage.create(message)
        // await PrivateConversation.updateOne({ _id: message.conversationId }, {
        //     $set: {
        //         lastMessageContent: message.content,
        //     },
        //     $inc: {
        //         unreadCount: 1
        //     }
        // })
    } catch (error) {
        console.log(error)

    }
}

const saveMessageSeenInDB = async (message: PrivateMessageSeen) => {
    try {
      await PrivateMessage.updateMany({ _id: message.messageIds }, {
            $push: {
                seenBy: { $each: [message.memberId], $position: 0 }
            },
        })
        
    } catch (error) {
        console.log(error)
    }
}
export {
    saveMessageInDB,
    saveMessageSeenInDB
}