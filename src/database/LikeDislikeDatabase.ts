import { LikeDislike, modelLike } from "../models/LikeDislike";
import { BaseDatabase } from "./BaseDatabase";


export class LikeDislikeDatabase extends BaseDatabase {
    private static TABLE_LIKES = "likes_dislikes"
    private static TABLE_POSTS = "posts"

    public async like(input: LikeDislike): Promise<void> {
        await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES)
            .insert(input)
    }

    public async updateLike(input: LikeDislike): Promise<void> {
        await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES)
            .update({
                like: input.getLike()
            })
    }

    public async getLikeById({ userId, postId }: modelLike): Promise<modelLike[]> {
        return await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES)
            .where({ userId })
            .andWhere({ postId })
    }

    // public async updateLikesAndDislikes(): Promise<void> {
    //     return BaseDatabase.connection.transaction(async (trx) => {
    //         await trx(LikeDislikeDatabase.TABLE_POSTS)
    //             .select("id")
    //             .then(async (posts) => {
    //                 for (const post of posts) {
    //                     const postId = post.id;

    //                     const likesCount = await trx(LikeDislikeDatabase.TABLE_LIKES)
    //                         .count("*")
    //                         .where({ postId })
    //                         .andWhere({ like: 1 })
    //                         .first();

    //                     const dislikesCount = await trx(LikeDislikeDatabase.TABLE_LIKES)
    //                         .count("*")
    //                         .where({ postId })
    //                         .andWhere({ like: 0 })
    //                         .first();

    //                     await trx(LikeDislikeDatabase.TABLE_POSTS)
    //                         .update({
    //                             likes: likesCount?.count || 0,
    //                             dislikes: dislikesCount?.count || 0
    //                         })
    //                         .where({ id: postId });
    //                 }
    //             });
    //     });
    // }
}