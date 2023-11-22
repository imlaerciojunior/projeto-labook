import z from 'zod'

export interface EditPostInputDTO{
    idToEdit: string,
    id?: string,
    creatorId?:string,
    content?:string,
    likes?:number,
    dislikesNumbers?:number,
}

export interface EditPostOutputDTO{
    message: string,
    post:{
        id: string | undefined,
        creatorId:string | undefined,
        content:string | undefined,
        likes:number | undefined,
        dislikesNumbers:number| undefined
    }
}4

export const EditPostSchema = z.object({
    idToEdit:  z.string().min(2),
    id: z.string().min(1).optional(),
    creatorId:z.string().min(1).optional(),
    content:z.string().min(1).optional(),
    likes:z.number().min(1).optional(),
    dislikesNumbers:z.number().min(1).optional(),
})