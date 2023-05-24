import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostSchema } from "../dtos/CreatePost.dto";
import { LikeDislikeSchema } from "../dtos/LikeDislike.dto";
import { DeletePostSchema } from "../dtos/DeletePost.dto";
import { ZodError } from "zod";
import { BaseError } from "../error/BaseError";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

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
        res.status(500).send("Erro inesperado");
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

      res.status(201).send(result).send({ message: "Post criado com sucesso!" })
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

  public like = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = LikeDislikeSchema.parse({
        token: req.headers.authorization as string,
        post_id: req.params.id
      })

      const result = await this.postBusiness.like(input)

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

  public dislike = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = LikeDislikeSchema.parse({
        token: req.headers.authorization as string,
        post_id: req.params.id
      })

      const result = await this.postBusiness.dislike(input)

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

  public editPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = PostSchema.parse({
        id: req.params.id,
        content: req.body.content,
      });

      await this.postBusiness.editPost(input)

      res.status(201).send({ message: "Post editado com sucesso" });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
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

      res.status(201).send(result).send({ message: "Post deletado com sucesso" });
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
