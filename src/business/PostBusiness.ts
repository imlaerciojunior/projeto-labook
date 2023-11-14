import { PostDatabase } from "../database/PostDatabase";
import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Posts";
import { PostsDB } from "../types";

export class PostBusiness {
    public getPosts = async (input: any) => {
        const { q } = input;
    
        const postDatabase = new PostDatabase();
        const postsDB = await postDatabase.findPosts(q);
    
        const posts: Post[] = postsDB.map(
          (postsDB) =>
            new Post(
              postsDB.id,
              postsDB.creator_id,
              postsDB.content,
              postsDB.likes,
              postsDB.dislikes_numbers,
              postsDB.created_at,
              postsDB.updated_at
            )
        );
        return posts;
      };

    public createPost = async (input: any) => {
        const { id, creatorId, content, likes, dislikesNumbers } = input;
    
        if (typeof id !== "string" || id.length < 4) {
          throw new BadRequestError(
            "O campo 'id' deve ser uma string com pelo menos 4 caracteres"
          );
        }
    
        if (typeof creatorId !== "string") {
          throw new BadRequestError(
            "O campo 'creatorId' deve ser uma string"
          );
        }
    
        if (typeof content !== "string" || content.length < 1) {
          throw new BadRequestError(`O campo 'content' deve ter pelo menos 1 caracter.`);
        }

        if (typeof likes !== "number") {
          throw new BadRequestError(
            `O campo 'likes' deve ser um número`
          );
        }

        if (typeof dislikesNumbers !== "number") {
            throw new BadRequestError(
              `O campo 'likes' deve ser um número`
            );
          }
    
        const postDatabase = new PostDatabase();
            
        const newPost = new Post(
          id,
          creatorId, 
          content, 
          likes, 
          dislikesNumbers,
          new Date().toISOString(),
          new Date().toISOString()
        );
    
        const newPostDB: PostsDB = {
          
            id: newPost.getId(),
            creator_id: newPost.getCreatorId(),
            content: newPost.getContent(),
            likes: newPost.getLikes(),
            dislikes_numbers: newPost.getDislikes(),
            created_at: newPost.getCreatedAt(),
            updated_at: newPost.getUpdatedAt()
          
        };
    
        await postDatabase.insertPost(newPostDB);
    
        return newPost;
      };

    public updatePost = async (input: any) => {
        const { id, creatorId, content, likes, dislikesNumbers } = input;
    
        if (typeof id !== "string" || id.length < 4) {
          throw new BadRequestError(
            "O campo 'id' deve ser uma string com pelo menos 4 caracteres"
          );
        }
    
        if (typeof creatorId !== "string" || creatorId.length < 3) {
          throw new BadRequestError(
            "O campo 'nome' deve ser uma string com pelo menos 3 caracteres"
          );
        }
    
        if (typeof content !== "string" || content.length < 1) {
          throw new BadRequestError(`O campo 'content' deve ter pelo menos 1 caracter.`);
        }

        if (typeof likes !== "number") {
          throw new BadRequestError(
            `O campo 'likes' deve ser um número`
          );
        }

        if (typeof dislikesNumbers !== "number") {
            throw new BadRequestError(
              `O campo 'likes' deve ser um número`
            );
          }
    
        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);
    
        if (!postDBExists) {
          throw new BadRequestError("Usuário não econtrado");
        }
    
        postDBExists.id = id;
        postDBExists.creator_id = creatorId;
        postDBExists.content = content;
        postDBExists.likes = likes;
        postDBExists.dislikes_numbers = dislikesNumbers;
    
        await postDatabase.updatePost(postDBExists);
    
        return postDBExists;
    };

    public deletePost = async (input: any) => {
        const { id } = input;
    
        if (typeof id !== "string") {
          throw new BadRequestError("O campo 'id' deve ser umas string");
        }
    
        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);
    
        if (!postDBExists) {
          throw new BadRequestError("Não foi possível encontrar o usuário");
        }
    
        await postDatabase.deletePost(id)
    
        return postDBExists;
      };

}

