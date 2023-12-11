import { z } from 'zod';
const zodUserSchema = z.object({
    // username -->
    username: z.string({required_error:"Name is required"})
    .min(3,{message:"Name must be at least 3 characters long"})
    .max(20,{message:"Name must be at most 20 characters long"}),
    // email -->
    email: z.string({required_error:"Email is required"}).email({message:"Invalid email"}),
    // password -->
    password: z.string({required_error:"Password is required"}).min(6,{message:"Password must be at least 6 characters long"})
    .max(20,{message:"Password must be at most 20 characters long"}),
    // profilePicture -->
    profilePicture: z.string({required_error:"Profile picture is required"}).optional(),
    // coverPicture -->
    coverPicture: z.string({required_error:"Cover picture is required"}).optional(),
    // followers -->
    followers: z.array(z.string()).optional(),
    // followings -->
    followings: z.array(z.string()).optional(),
    // privateIds -->
    privateIds: z.array(z.string()).optional(),
    // groupIds -->
    groupIds: z.array(z.string()).optional(),
    // bio -->
    bio: z.string({required_error:"Bio is required"}).max(50,{message:"Bio must be at most 50 characters long"}).optional(),
    // city -->
    city: z.string({required_error:"City is required"}).max(50,{message:"City must be at most 50 characters long"}).optional(),
    // from -->
    from: z.string({required_error:"From is required"}).max(50,{message:"From must be at most 50 characters long"}).optional(),
});

export default zodUserSchema;