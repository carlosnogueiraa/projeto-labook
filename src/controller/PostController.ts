import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostSchema } from "../dtos/CreatePost.dto";
import { LikeDislikeSchema } from "../dtos/LikeDislike.dto";
import { DeletePostSchema } from "../dtos/DeletePost.dto";
import { ZodError } from "zod";
import { BaseError } from "../error/BaseError";
import { EditPostSchema } from "../dtos/EditPost.dto";

export class PostController {
  constructor(private postBusiness: PostBusiness) { }

  public getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const token: string = req.headers.authorization as string

      const result = await this.postBusiness.getAllPosts(token)

      res.status(201).send(result);
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

  public createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = PostSchema.parse({
        token: req.headers.authorization as string,
        content: req.body.content
      });

      const result = await this.postBusiness.createPost(input)

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

  public editPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = EditPostSchema.parse({
        id: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      })

      await this.postBusiness.editPost(input)

      res.status(201).send({ message: "Post editado com sucesso" });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  };

  public deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = DeletePostSchema.parse({
        id: req.params.id,
        token: req.headers.authorization as string
      });

      const result = await this.postBusiness.deletePost(input)

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
}
