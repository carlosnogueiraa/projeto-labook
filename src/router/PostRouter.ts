import { Router } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostController } from "../controller/PostController"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { Authenticator } from "../services/Authenticator"

export const postRouter = Router()

const postController = new PostController(
    new PostBusiness (
        new PostDatabase(),
        new IdGenerator(),
        new Authenticator()
    )
)


postRouter.get("/", postController.getAllPosts)

postRouter.post("/", postController.createPost)
postRouter.post("/like/:id", postController.like)
postRouter.post("/dislike/:id", postController.dislike)

postRouter.put("/:id", postController.editPost)

postRouter.delete("/:id", postController.deletePost)


