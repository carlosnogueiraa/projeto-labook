import z from "zod"

export interface DeletePostDTO {
    token: string,
    id: string
}

export const DeletePostSchema = z.object({
    token: z.string({
        invalid_type_error: "O token precisa ser uma string",
        required_error: "O token é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
    id: z.string({
        invalid_type_error: "O id precisa ser uma string",
        required_error: "O id é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
}).transform(data=> data as DeletePostDTO)