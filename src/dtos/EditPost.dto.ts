import z from "zod"

export interface EditPostDTO {
    id: string,
    token: string,
    content: string,
}

export const EditPostSchema = z.object({
    id: z.string({
        invalid_type_error: "O token precisa ser uma string",
        required_error: "O token é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
    token: z.string({
        invalid_type_error: "O token precisa ser uma string",
        required_error: "O token é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
    content: z.string({
        invalid_type_error: "O content precisa ser uma string",
        required_error: "O content é obrigatório"
    })
    .min(3,  "Precisa de pelo menos 3 caracteres")
}).transform(data => data as EditPostDTO)