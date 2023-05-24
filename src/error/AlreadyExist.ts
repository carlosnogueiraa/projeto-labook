import { BaseError } from "./BaseError";

export class AlreadyExistError extends BaseError {
    constructor(
        public message = "Item já existe"
    ){
        super(406, message)
    }
}