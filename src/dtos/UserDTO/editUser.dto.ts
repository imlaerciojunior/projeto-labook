import z from "zod";

export interface EditUserInputDTO {
  idToEdit: string;
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface EditUserOutputDTO {
  message: string;
  user: {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    role: string | undefined;
  };
}

export const EditUserSchema = z.object({
  idToEdit: z.string().min(2),
  id: z.string().min(1).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  role: z.string().min(1).optional(),
});
