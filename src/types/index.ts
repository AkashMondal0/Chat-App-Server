
interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    coverPicture?: string;
    followers?: string[];
    followings?: string[];
    privateIds?: string[];
    groupIds?: string[];
    bio?: string;
    city?: string;
    from?: string;
    updatedAt?: string;
    createdAt?: string;
    status?: [
        {
            _id: string,
            url: string,
            type: 'image' | 'video' | 'audio' | "text"
            forText?: string;
            forTextBackground?: boolean;
            forTextColor?: string;
            forTextSize?: string;
            seen?:string[];
            createdAt: string | Date;
        }
    ];
    isOnline?: boolean;
    _doc?: User;
}

interface File {
    url: string;
    type: 'image' | 'video' | 'audio' | 'file';
}

interface PrivateMessage {
    createdAt: string | undefined;
    _id: string;
    content: string;
    fileUrl?: File[];
    memberId: string;
    conversationId: string;
    deleted: boolean;
    seenBy: User[];
    deliveredTo: User[];
}

interface PrivateChat {
    _id?: string;
    users?: [
        User['_id'],
    ];
    userDetails?: User;
    lastMessageContent: string;
    messages?: PrivateMessage[];
    updatedAt?: string | Date;
    createdAt?: string | Date;
    typing?: boolean;
    loadAllMessages?: boolean | undefined;
    page?: number | undefined;
}
enum Role {
    admin =
    "admin",
    member =
    "member",
    coAdmin =
    "co-admin",
}
interface GroupChat {
    _id: string;
    name: string;
    description: string;
    admins?: User[];
    members: [
        {
            role: Role,
            userId: string,
            _id: string
        },
    ];
    lastMessageContent: string;
    messages?: PrivateMessage[];
    updatedAt?: string | Date;
    createdAt?: string | Date;
    typing?: boolean;
    loadAllMessages?: boolean | undefined;
    page?: number | undefined;
    createdBy: User;
    picture?: string;
    Users?: User[];
}

export {
    User,
    PrivateMessage,
    PrivateChat,
    File,
    GroupChat,
};
export default User;