import mongoose from 'mongoose';
import { User } from '../types';

const UserSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
    },
    coverPicture: {
        type: String,
    },
    status:{
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    privateIds: {
        type: Array,
        default: []
    },
    groupIds: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);