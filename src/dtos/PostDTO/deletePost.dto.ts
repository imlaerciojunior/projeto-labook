import z from 'zod'

export interface DeletePostInputDTO {
    idToDelete: string,
    id: string
}

export interface DeletePostOutputDTO {
    message: string,
    post:{
        id:string
    }
}

export const DeletePostSchema = z.object({
    idToDelete: z.string().min(3)
}).transform(data => data as DeletePostInputDTO)