import { Post, PostDB, LikeDB } from "../models/Post";
import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  private TABLE_POSTS = "posts";
  private TABLE_USERS = "users";
  private TABLE_LIKES = "likes_dislikes"

  public createPost = async (post: Post): Promise<void> => {
    const id = post.getId()
    const userId = post.getUserId()
    const content = post.getContent()

    await BaseDatabase.connection(this.TABLE_POSTS).insert({
      id,
      content,
      user_id: userId
    });
  }

  public getUserById = async (id: string): Promise<PostDB | undefined> => {
    const [user] = await BaseDatabase.connection(this.TABLE_USERS)
      .select("*")
      .where({ id });

    return user
  }

  public getAllPosts = async (): Promise<PostDB[]> => {
    return BaseDatabase.connection(this.TABLE_POSTS).select("*");
  };

  public getPostById = async (id: string): Promise<PostDB | undefined> => {
    const [post] = await BaseDatabase.connection(this.TABLE_POSTS)
      .select("*")
      .where({ id })

    return post
  }

  public deletePostById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_POSTS).delete().where({ id })
  }

  public like = async (like: LikeDB): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_LIKES).insert(like)
  }

  public dislike = async (userId: string, postId: string): Promise<void> => {
    await BaseDatabase.connection(this.TABLE_LIKES)
      .delete()
      .where({ post_id: postId, user_id: userId })
  }

  public getLikePost = async (userId: string, postId: string): Promise<LikeDB[]> => {
    return BaseDatabase.connection(this.TABLE_LIKES)
      .select("*")
      .where({ post_id: postId, user_id: userId })
  }

  public editPost = async (post: Post): Promise<void> => {
    const id = post.getId()
    const content = post.getContent()

    await BaseDatabase.connection(this.TABLE_POSTS)
      .update({ content })
      .where({ id })
  }
}
