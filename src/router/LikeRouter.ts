import express from "express"
import { LikeDislikeController } from "../controller/LikeDislikeController"
import { LikeDislikeBusiness } from "../business/LikeDislikeBusiness"
import { LikeDislikeDatabase } from "../database/LikeDislikeDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { Authenticator } from "../services/Authenticator"


export const likeRouter = express.Router()

// const likeDislikeController = new LikeDislikeController(
//     new PostDatabase(),
//     new Authenticator(),
//     new LikeDislikeBusiness(
//         new LikeDislikeDatabase()
//     )
// )

const likeDislikeDatabase = new LikeDislikeDatabase()
const postDatabase = new PostDatabase()
const authenticator = new Authenticator()
const likeDislikeBusiness = new LikeDislikeBusiness(likeDislikeDatabase)
const likeDislikeController = new LikeDislikeController(
    likeDislikeBusiness,
    postDatabase,
    authenticator
)

likeRouter.post("/:id/like", likeDislikeController.like)