import z from "zod"

export interface LikeDislikeInputDTO {
    token: string,
    post_id: string
}

export const LikeDislikeSchema = z.object({
    post_id: z.string({
        invalid_type_error: "O post_id precisa ser uma string",
        required_error: "O post_id é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
}).transform(data=> data as LikeDislikeInputDTO)