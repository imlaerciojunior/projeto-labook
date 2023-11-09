export interface UserDB {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
  };

export type PostsDB = {
    id: string;
    creator_id: string;
    content: string;
    likes: number;
    dislikes_numbers: number;
    created_at: string;
    updated_at: string;
  };