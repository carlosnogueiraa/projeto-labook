import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness,";
import { ZodError } from "zod";
import { BaseError } from "../error/BaseError";
import { SignupInputDTO } from "../dtos/SignupInput.dto";
import { LoginInputDTO } from "../dtos/LoginInput.dto";


export class UserController {
    constructor (private userBusiness: UserBusiness) {}

    public signup = async (req: Request, res: Response) => {
        try {
            const input: SignupInputDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const result = await this.userBusiness.signup(input)

            res.status(201).send(result)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send(error);
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }

            const result = await this.userBusiness.login(input)

            res.status(201).send(result)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    }
}

