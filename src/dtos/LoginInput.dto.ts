import z from "zod"


export interface LoginInputDTO {
    email: string,
    password: string
}

export const LoginSchema = z.object({
    email: z.string({
        invalid_type_error: "O email precisa ser uma string",
        required_error: "O email é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
    password: z.string({
        invalid_type_error: "O password precisa ser uma string",
        required_error: "O password é obrigatório"
    })
    .min(1, "Precisa de pelo menos 3 caracteres")
}).transform(data => data as LoginInputDTO)