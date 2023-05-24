import { User } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";


export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public createUser = async (user: User) => {
        const id = user.getId()
        const name = user.getName()
        const email = user.getEmail()
        const password = user.getPassword()
        const role = user.getRole()

        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .insert({ id,name,email, password,role })
    }

    public getUserByEmail = async (email: string) => {
        const result = await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .select("*")
            .where({ email })

        return result[0]
    }
}