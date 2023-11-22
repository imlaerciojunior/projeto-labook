import z from "zod";

export interface CreatePostInputDTO {
  id: string;
  creatorId: string;
  content: string;
  likes: number;
  dislikesNumbers: number;
}

export interface CreatePostOutputDTO {
  message: string;
  post: {
    id: string;
    creatorId: string;
    content: string;
    likes: number;
    dislikesNumbers: number;
    createdAt: string;
    updatedAt: string;
  };
}

export const CreatePostSchema = z.object({
    id: z.string().min(1),
    creatorId: z.string().min(4),
    content: z.string().min(2),
    likes: z.number(),
    dislikesNumbers: z.number()
  }).transform(data => data as CreatePostInputDTO)