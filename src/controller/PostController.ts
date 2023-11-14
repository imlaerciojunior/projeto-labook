import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";

export class PostController {
  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = {
        q: req.query.q as string | undefined,
      };

      const postBusiness = new PostBusiness();
      const response = await postBusiness.getPosts(input);

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
      const input = {
        id: req.body.id,
        creator_id: req.body.creatorId,
        content: req.body.content,
        likes: req.body.likes,
        dislikes_numbers: req.body.dislikesNumbers,
      };

      const postBusiness = new PostBusiness();
      const response = await postBusiness.createPost(input);

      res.status(201).send(`Post criado com sucesso!!`);
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

  public updatePost = async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.params.id,
        creator_id: req.body.creatorId,
        content: req.body.content,
        likes: req.body.likes,
        dislikes_numbers: req.body.dislikesNumbers
      };

      const postBusiness = new PostBusiness();
      const response = await postBusiness.updatePost(input);

      res.status(201).send(`Post atualizado com sucesso`);
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

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.params.id,
      };

      const postBusiness = new PostBusiness();
      const response = await postBusiness.deletePost(input);

      res.status(200).send(`Post deletado com sucesso`);
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
}
