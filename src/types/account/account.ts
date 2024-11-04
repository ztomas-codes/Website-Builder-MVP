import {z} from "zod";

export const emailSchema = z.object({
    email: z.string().email(),
});

export const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    nickname: z.string().min(1),
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const userAccountInfoSchema = z.object({
    session_id: z.string().min(1),
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;
export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;