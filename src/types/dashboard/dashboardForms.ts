import {z} from "zod";

export const mainInfo = z.object({
    smtp_host: z.string().min(1),
    smtp_port: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    smtp_secure: z.string(),
    smtp_user: z.string().min(1),
    smtp_pass: z.string().min(1),
    domain: z.string().min(1),
    currency: z.string().min(1),
    stripe: z.string().min(1),
});

export const productForm = z.object({
    id: z.number().optional(),
    category_id: z.number(),
    name: z.string().min(1),
    cost: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    visible: z.boolean(),
    image: z.string().min(1),
    description: z.string().min(1),
});

export const categoryForm = z.object({
    name: z.string().min(1),
});

export const pageForm = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1),
});

export const componentForm = z.object({
    id: z.number().optional(),
    name: z.string().min(1),
    categories: z.string().optional(),
});

export const fileForm = z.object({
    id: z.number(),
    name: z.string().min(1),
    type: z.string().min(1),
    content: z.string().min(1),
    order: z.number()
});

export type FileForm = z.infer<typeof fileForm>;
export type ComponentForm = z.infer<typeof componentForm>;
export type PageForm = z.infer<typeof pageForm>;
export type MainInfo = z.infer<typeof mainInfo>;
export type ProductForm = z.infer<typeof productForm>;