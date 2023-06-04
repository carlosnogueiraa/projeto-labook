import { UserDatabase } from "../database/UserDatabase"
import { LoginInputDTO } from "../dtos/LoginInput.dto"
import { SignupInputDTO } from "../dtos/SignupInput.dto"
import { CustomError } from "../error/CustomError"
import { USER_ROLES, User } from "../models/User"
import { Authenticator, TokenPayload } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"


export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) {}

    public signup = async (input: SignupInputDTO) => {
        const { name, email, password } = input

        if (!name || !email || !password) {
            throw new CustomError(404, "Um ou mais parâmetros faltando!")
        }

        if (typeof name !== "string" || name.length < 3) {
            throw new CustomError(404, "Parâmetro 'name' inválido")
        }

        if (typeof email !== "string" || email.indexOf("@") === -1) {
            throw new CustomError(404, "Parâmetro 'email' inválido")
        }

        if (typeof password !== "string" || password.length < 6) {
            throw new CustomError(404, "Parâmetro 'password' inválido")
        }

        const emailExists = await this.userDatabase.getUserByEmail(email)
        
        if (emailExists) {
            throw new CustomError(406, "O email já está cadastrado!")
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)

        const user = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL
        )

        await this.userDatabase.createUser(user)
        
        const payload: TokenPayload = {
            id: user.getId(),
            role: user.getRole()
        }
        
        const token = this.authenticator.generateToken(payload)

        const result = {
            message: "Cadastro realizado com sucesso!",
            token
        }

        return result
    }

    public login = async (input: LoginInputDTO) => {
        const { email, password } = input

        if (!email || !password) {
            throw new CustomError(404, "Um ou mais parâmetros faltando!")
        }

        if (typeof email !== "string" || email.length < 3) {
            throw new CustomError(404, "Parâmetro 'Email' inválido!")
        }

        if (typeof password !== "string" || email.length < 6) {
            throw new CustomError(404, "Parâmetro 'Password' inválido!")
        }

        if (
            !email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            )
        ) {
            throw new CustomError(404, "Email inválido!")
        }

        const userDB = await this.userDatabase.getUserByEmail(email)

        if (!userDB) {
            throw new CustomError(404, "Email não cadastrado!")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role
        )

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            user.getPassword()
        )

        if (!isPasswordCorrect) {
            throw new CustomError(404, "Senha incorreta")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            role: user.getRole()
        }

        const token = this.authenticator.generateToken(payload)

        const result = {
            message: "Login realizado com sucesso!",
            token
        }

        return result
    }
}