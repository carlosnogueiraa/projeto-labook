import { Request, Response } from "express";
import { ZodError } from "zod";
import { LikeDislikeBusiness } from "../business/LikeDislikeBusiness";
import { LikeDislikeSchema } from "../dtos/LikeDislike.dto";
import { BaseError } from "../error/BaseError";
import { CustomError } from "../error/CustomError";
import { PostDatabase } from "../database/PostDatabase";
import { Authenticator } from "../services/Authenticator";


export class LikeDislikeController {
    constructor(
        private likeDislikeBusiness: LikeDislikeBusiness,
        private postDatabase: PostDatabase,
        private authenticator: Authenticator
    ) {}

    public like = async (req: Request, res: Response) => {        
        try {
            const { like } = req.body
            const { id: postId } = req.params
            const token = req.headers.authorization

            if (!token) {
                throw new CustomError(404, "Campo 'token' obrigatório!")
            }

            const payload = this.authenticator.getTokenPayload(token)

            
            if (!payload) {
                throw new CustomError(404, "Token inválido")
            }

            const userId = await this.postDatabase.getUserById(payload?.id)

            const input = LikeDislikeSchema.parse({
                userId: userId?.id,
                postId,
                like,
                token
            })

            const result = await this.likeDislikeBusiness.like(input)

            res.status(200).send(result)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send(error)
            }
        }
    }
}