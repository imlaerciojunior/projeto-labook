import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/PostDTO/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/PostDTO/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/PostDTO/editPosts.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Posts";
import { PostsDB } from "../types";

export class PostBusiness {

  constructor(
    private postDatabase: PostDatabase
  ){}

    public getPosts = async (input: any) => {
        const { q } = input;
    
        // const postDatabase = new PostDatabase();
        const postsDB = await this.postDatabase.findPosts(q);
    
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

      public createPosts = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { id, creatorId, content, likes, dislikesNumbers } = input;
    
        // instanciando novo objeto
        const postDBExists = await this.postDatabase.findPostById(id);
    
        if (postDBExists) {
          throw new BadRequestError("'id' já existe");
        }
    
        const post = new Post(
          id,
          creatorId,
          content,
          likes,
          dislikesNumbers,  
          new Date().toISOString(),
          new Date().toISOString()
        );
    
        const newPostDB: PostsDB = {
          id: post.getId(),
          creator_id: post.getCreatorId(),
          content: post.getContent(),
          likes: post.getLikes(),
          dislikes_numbers: post.getDislikes(),
          created_at: post.getCreatedAt(),
          updated_at: post.getUpdatedAt(),
        };
    
        await this.postDatabase.insertPost(newPostDB);
    
        const output: CreatePostOutputDTO = {
          message: "criado com sucesso",
          post :{
            id: post.getId(),
            creatorId: post.getCreatorId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikesNumbers: post.getDislikes(),
            createdAt: post.getCreatedAt(),
            updatedAt: post.getUpdatedAt()
          }
        }
    
        return output;
      };
    

      public updatePosts = async (input: EditPostInputDTO):Promise<EditPostOutputDTO> => {
    
        const { idToEdit, id, creatorId, content, likes, dislikesNumbers } = input;
    
        // const postDatabase = new PostDatabase();
        const postDBExists = await this.postDatabase.findPostById(idToEdit);
    
        if (!postDBExists) {
           throw new NotFoundError("'id' não encontrado");
        }
    
        const post = new Post(
          postDBExists.id,
          postDBExists.creator_id,
          postDBExists.content,
          postDBExists.likes,
          postDBExists.dislikes_numbers,
          postDBExists.created_at,
          postDBExists.updated_at
        )
    
        id && post.setId(id)
        creatorId && post.setCreatorId(creatorId)
        content && post.setContent(content)
        likes && post.setLikes(likes)
        dislikesNumbers && post.setDislikes(dislikesNumbers)

        const newPostDB: PostsDB = {
          id: post.getId(),
          creator_id: post.getCreatorId(),
          content: post.getContent(),
          likes: post.getLikes(),
          dislikes_numbers: post.getDislikes(),
          created_at: post.getCreatedAt(),
          updated_at: post.getUpdatedAt(),
        };
    
        await this.postDatabase.updatePost(newPostDB);
    
        const output: EditPostOutputDTO={
          message:"Post editado com sucesso",
          post:{
            id: post.getId(),
            creatorId: post.getCreatorId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikesNumbers: post.getDislikes()
          }
        }
    
        return output;
      };

      public deletePosts = async (input: DeletePostInputDTO):Promise<DeletePostOutputDTO> => {
        const { idToDelete } = input;
    
        // const postDatabase = new PostDatabase();
        const postDBExists = await this.postDatabase.findPostById(idToDelete);
    
        if (!postDBExists) {
          throw new NotFoundError("Não foi possível encontrar o post");
        }
    
        await this.postDatabase.deletePost(idToDelete);
    
        const output: DeletePostOutputDTO = {
          message:"Post deletado com sucesso",
          post:{
            id: idToDelete
          }
        
        }
        return output;  
      };
    

}

