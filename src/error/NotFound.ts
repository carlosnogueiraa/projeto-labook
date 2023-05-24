import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
    constructor(
        public message = "Item não encontrado"
    ){
        super(404, message)
    }
}