import z from 'zod'

export interface CreateUserInputDTO {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: string
}

export interface CreateUserOutputDTO{
    user:{
        id: string,
        name: string,
        email: string,
        role: string,
        createdAt: string
    }
}

export const CreateUserSchema = z.object({
    id: z.string().min(3),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
    role: z.string().min(2),
   }).transform(data => data as CreateUserInputDTO)