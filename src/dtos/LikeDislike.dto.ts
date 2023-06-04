import z from "zod"

export interface LikeDislikeInputDTO {
    userId: string,
    postId: string,
    token: string,
    like: number
}

export interface LikeDislikeOutputDTO {
    like: boolean
}

export const LikeDislikeSchema = z.object({
    userId: z.string(),
    postId: z.string(),
    token: z.string(),
    like: z.number()
}).transform((data) => data as LikeDislikeInputDTO)