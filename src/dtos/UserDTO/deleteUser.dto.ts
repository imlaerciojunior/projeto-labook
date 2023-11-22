import z from 'zod'

export interface DeleteUserInputDTO {
    idToDelete: string,
    id: string
}

export interface DeleteUserOutputDTO{
    message: string,
    user:{
        id: string
    }
}

export const DeleteUserSchema = z.object({
    idToDelete: z.string().min(3),
 }).transform(data=> data as DeleteUserInputDTO)