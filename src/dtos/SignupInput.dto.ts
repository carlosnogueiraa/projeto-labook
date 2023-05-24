import z from "zod"


export interface SignupInputDTO {
    name: string,
    email: string,
    password: string
}

export const SignupSchema = z.object({
    name: z.string({
        invalid_type_error: "O name precisa ser uma string",
        required_error: "O name é obrigatório"
    })
    .min(1, "Precisa de pelo menos 1 caractere"),
    email: z.string(
        {
            invalid_type_error: "O email precisa ser uma string",
            required_error: "O email é obrigatório"
        }
    ).min(3,  "Precisa de pelo menos 3 caracteres"),
    password: z.string({
        invalid_type_error: "O password precisa ser uma string",
        required_error: "O password é obrigatório"
    })
    .min(1, "Precisa de pelo menos 3 caracteres")
}).transform(data => data as SignupInputDTO)