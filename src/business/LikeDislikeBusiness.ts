import { LikeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { LikeDislikeInputDTO, LikeDislikeOutputDTO } from "../dtos/LikeDislike.dto";
import { CustomError } from "../error/CustomError";
import { LikeDislike } from "../models/LikeDislike";


export class LikeDislikeBusiness {
    constructor(
        private likeDislikeDatabase: LikeDislikeDatabase
    ) { }

    public async like(input: LikeDislikeInputDTO): Promise<LikeDislikeOutputDTO> {
        const { userId, postId, like } = input
        

        const userDatabase = new PostDatabase()
        const isUser = await userDatabase.getUserById(userId)

        if (!isUser) {
            throw new CustomError(404, "Usuário não cadastrado")
        }

        const postDatabase = new PostDatabase()
        const isPost = await postDatabase.getPostById(postId)

        if (!isPost) {
            throw new CustomError(404, "Post não cadastrado")
        }

        if (like !== 0 && like !== 1) {
            throw new CustomError(404, "Insira 0 ou 1")
        }

        const newLike = new LikeDislike(userId, postId, like)

        const [isLike] = await this.likeDislikeDatabase.getLikeById(input)

        if (isLike) {
            await this.likeDislikeDatabase.updateLike(newLike)
            // await this.likeDislikeDatabase.updateLikesAndDislikes()
        } else {
            await this.likeDislikeDatabase.like(newLike)
            // await this.likeDislikeDatabase.updateLikesAndDislikes()
        }

        if (like === 1) {
            return {
                like: true
            }
        } else {
            return {
                like: false
            }
        }
    }

    public async updateLike(input: LikeDislike): Promise<void> {
        await this.likeDislikeDatabase.updateLike(input)
    }
}
