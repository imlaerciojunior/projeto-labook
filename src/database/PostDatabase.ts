import { PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts";

    public async findPosts(q: string | undefined) {
        let postsDB;
    
        if (q) {
          const result: PostsDB[] = await BaseDatabase
          .connection(PostDatabase.TABLE_POSTS)
          .where("name", "LIKE", `%${q}%`);
    
          postsDB = result;
        } else {
          const result: PostsDB[] = await BaseDatabase
          .connection(PostDatabase.TABLE_POSTS);
    
          postsDB = result;
        }
        return postsDB;
      }

    public async findPostById(id: string) {
        const [postsDB]: PostsDB[] | undefined[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({ id });
    
        return postsDB;
      }
    
    public async insertPost(newPostDB: PostsDB) {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .insert(newPostDB);
      }
    
    public async updatePost(newPost: PostsDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
          .where({ id: newPost.id })
          .update({
            creator_id: newPost.creator_id,
            content: newPost.content,
            likes: newPost.likes,
            dislikes_numbers: newPost.dislikes_numbers
          });
      }
    
    public async deletePost(id: string) {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({ id })
        .delete();
      }
}
