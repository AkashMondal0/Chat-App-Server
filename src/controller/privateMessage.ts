// import PrivateConversation from "../model/Private-Conversation"
import PrivateMessage from "../model/Private-Message"
import { PrivateMessageSeen, privateMessage } from "../routes/private/chat"


const saveMessageInDB = async (message: privateMessage) => {
    try {
        // console.log(message)
        await PrivateMessage.create(message)

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