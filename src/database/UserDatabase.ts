import { USER_ROLES, User, UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";


export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public userDBModel = (user: User) => {
        const userDB: UserDB = {
            id : user.getId(),
            name : user.getName(),
            email : user.getEmail(),
            password : user.getPassword(),
            role : user.getRole()
        }

        return userDB
    }

    public createUser = async (user: User) => {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(this.userDBModel(user))
    }

    public getUserByEmail = async (email: string) => {
        const result = await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .select("*")
            .where({ email })

        return result[0]
    }
}