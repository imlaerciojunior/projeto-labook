import { LikeDislikeDB, POST_LIKE } from "../models/Posts";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { PostDatabase } from "../database/PostDatabase";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { USER_ROLES } from "../models/Users";
import { Post } from "../models/Posts";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/PostDTO/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/PostDTO/getPost.dto";
import { UpdatePostInputDTO, UpdatePostOutputDTO } from "../dtos/PostDTO/updatePosts.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/PostDTO/deletePost.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/PostDTO/likeOrDislikePost.dto";

export class PostBusiness {
  constructor(
    private postDataBase: PostDatabase,
    private IdGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const postDBWithCreatorName =
      await this.postDataBase.findPostsWithCreatorName();

    const postModel = postDBWithCreatorName.map((postWithCreatorName) => {
      const post = new Post(
        postWithCreatorName.id,
        postWithCreatorName.content,
        postWithCreatorName.likes,
        postWithCreatorName.dislikes,
        postWithCreatorName.created_at,
        postWithCreatorName.updated_at,
        postWithCreatorName.creator_id,
        postWithCreatorName.creator_name
      );

      return post.toBusinissModel();
    });

    const response: GetPostsOutputDTO = postModel;

    return response;
  };

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const id = this.IdGenerator.generate();

    const post = new Post(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const postDB = post.toDBModel();

    await this.postDataBase.insertPost(postDB);

    const response: CreatePostOutputDTO = undefined;

    return response;
  };

  public updatePost = async (
    input: UpdatePostInputDTO
  ): Promise<UpdatePostOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token inválido");
    }

    const postBR = await this.postDataBase.findPostById(idToEdit);

    if (!postBR) {
      throw new NotFoundError("post com esse id não existe");
    }

    if (payload.id !== postBR.creator_id) {
      throw new BadRequestError("somente quem criou o post pode edita-lo");
    }

    const post = new Post(
      postBR.id,
      postBR.content,
      postBR.likes,
      postBR.dislikes,
      postBR.created_at,
      postBR.updated_at,
      postBR.creator_id,
      payload.name
    );

    post.setContent(content);

    const updatePostDB = post.toDBModel();
    await this.postDataBase.updatePost(updatePostDB);

    const response: UpdatePostOutputDTO = undefined;

    return response;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("post com esse id não existe");
    }

    const playlistDB = await this.postDataBase.findPostById(idToDelete);

    if (!playlistDB) {
      throw new NotFoundError("playlist com essa id não existe");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== playlistDB.creator_id) {
        throw new BadRequestError("somente quem criou a post pode apagar");
      }
    }

    await this.postDataBase.deletePost(idToDelete);

    const output: DeletePostOutputDTO = undefined;

    return output;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { token, like, postId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("token não existe");
    }

    const postDBWithCreatorName =
      await this.postDataBase.findPostWithCreatorNameById(postId);

    if (!postDBWithCreatorName) {
      throw new NotFoundError("post com essa id não existe");
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_name
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.postDataBase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDataBase.removeLikeDislike(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postDataBase.updateLikeDislike(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDataBase.removeLikeDislike(likeDislikeDB);
        post.removeDislike();
      } else {
        await this.postDataBase.updateLikeDislike(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      }
    } else {
      await this.postDataBase.insertLikeDislike(likeDislikeDB);
      like ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toDBModel();
    await this.postDataBase.updatePost(updatedPostDB);

    const output: LikeOrDislikePostOutputDTO = undefined;

    return output;
  };
}