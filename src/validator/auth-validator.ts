import { z } from 'zod';
const zodLoginSchema = z.object({
    // email -->
    email: z.string({required_error:"Email is required"}).email({message:"Invalid email"}),
    // password -->
    password: z.string({required_error:"Password is required"}).min(6,{message:"Password must be at least 6 characters long"})
    .max(20,{message:"Password must be at most 20 characters long"}),
});

export {
    zodLoginSchema
}