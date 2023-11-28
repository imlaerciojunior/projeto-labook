import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";
import { CreatePostSchema } from "../dtos/PostDTO/createPost.dto";
import { EditPostSchema } from "../dtos/PostDTO/editPosts.dto";
import { DeletePostSchema } from "../dtos/PostDTO/deletePost.dto";
import { GetPostsInputDTO, GetPostsSchema } from "../dtos/PostDTO/getPost.dto";

export class PostController {

  constructor(
    private postBusiness: PostBusiness
  ){}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input: GetPostsInputDTO = GetPostsSchema.parse({
        nameToSearch: req.query.name as string | undefined,
      });

      // const postBusiness = new PostBusiness();
      const response = await this.postBusiness.getPosts(input);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  };

  public createPosts = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        id: req.body.id,
        creatorId: req.body.creator_id,
        content: req.body.content,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
      });


      const output = await this.postBusiness.createPost(input);

      res.status(201).send({output});

    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
     } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
     } else {
        res.status(500).send("Erro inesperado")
     }
    }
  };

  public updatePosts = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        idToEdit: req.params.id,
        id: req.body.id,
        creator_id: req.body.creatorId,
        content: req.body.content,
        likes: req.body.likes,
        dislikes_numbers: req.body.dislikesNumbers,
      }) 

      const response = await this.postBusiness.updatePosts(input);

      res.status(201).send({ message: "atualizado com sucesso", response });
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
         res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
         res.status(error.statusCode).send(error.message)
      } else {
         res.status(500).send("Erro inesperado")
      }
    }
  };

  public deletePosts = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        idToDelete: req.params.id
      })

      const response = await this.postBusiness.deletePosts(input);

      res.status(200).send({message:'Excluído com sucesso', response});
      console.log(response);
      

    } catch (error) {

     console.log(error)

      if (error instanceof ZodError) {
         res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
         res.status(error.statusCode).send(error.message)
      } else {
         res.status(500).send("Erro inesperado")
      }
    }
  };
}
