import { Post, PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_USERS = "users";
  public static TABLE_LIKES = "likes_dislikes"

  public postDBModel = (post: Post) => {
    const postDB: PostDB = {
      id: post.getId(),
      creator: post.getUserId(),
      content: post.getContent()
    }

    return postDB
  }

  public createPost = async (post: Post): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(this.postDBModel(post))
  }

  public getUserById = async (id: string): Promise<PostDB | undefined> => {
    const [user] = await BaseDatabase.connection(PostDatabase.TABLE_USERS)
      .select("*")
      .where({ id });

    return user
  }

  public getAllPosts = async (): Promise<PostDB[]> => {
    return BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        "posts.id",
        "posts.content",
        "posts.likes",
        "posts.dislikes",
        "posts.createdAt",
        "posts.updatedAt",
        "users.id as creatorId",
        "users.name as creatorName"
      )
      .leftJoin("users", "posts.creatorId", "users.id");
  };

  public getPostById = async (id: string): Promise<PostDB | undefined> => {
    const [post] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select("*")
      .where({ id })

    return post
  }

  public deletePostById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).delete().where({ id })
  }

  public editPost = async (post: Post): Promise<void> => {
    const id = post.getId()
    const content = post.getContent()

    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update({ content })
      .where({ id })
  }
}
