import { PostDatabase } from "../database/PostDatabase";
import { CreatePostDTO } from "../dtos/CreatePost.dto";
import { DeletePostDTO } from "../dtos/DeletePost.dto";
import { EditPostDTO } from "../dtos/EditPost.dto";
import { CustomError } from "../error/CustomError";
import { NotFoundError } from "../error/NotFound";
import { Post, InputType } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) { }

  public getAllPosts = async (token: string) => {
    if (!token) {
      throw new Error("Você não está autorizado, é necessário fazer login!")
    }

    const payload = this.authenticator.getTokenPayload(token);

    if (!payload) {
      throw new Error("Token inválido!")
    }

    const posts = await this.postDatabase.getAllPosts()

    if (!posts.length) {
      throw new NotFoundError()
    }

    const result = { posts }

    return result
  }

  public createPost = async (input: CreatePostDTO): Promise<{ message: string }> => {
    const { content, token } = input

    if (!token) {
      throw new CustomError(404, "Campo token obrigatório!")
    }

    if (content.length < 1 || typeof content !== "string") {
      throw new CustomError(404, "Parâmetro 'content' inválido!")
    }

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
      throw new CustomError(404, "Token inválido!")
    }

    const userDB = await this.postDatabase.getUserById(payload.id)

    if (!userDB) {
      throw new CustomError(404, "'Id' não encontrado!")
    }

    const id = this.idGenerator.generate()

    const post = new Post(id, content, userDB.id)

    await this.postDatabase.createPost(post)

    const result = {
      message: "Post criado com sucesso!"
    }

    return result
  }

  public editPost = async (input: EditPostDTO): Promise<void> => {
    const { id, content, token } = input
    const postDB = await this.postDatabase.getPostById(id)

    if (!postDB) {
      throw new NotFoundError();
    }

    const payload = this.authenticator.getTokenPayload(token);
    if (!payload) {
      throw new CustomError(404, "Token inválido ou faltando");
    }

    if (payload.id !== postDB.creator) {
      throw new CustomError(404, "Você não tem permissão para fazer isso")
    }

    const alteredPost = new Post(
      id,
      content || postDB.content,
      postDB.creator
    );

    await this.postDatabase.editPost(alteredPost)
  }

  public deletePost = async (input: DeletePostDTO) => {
    const { id, token } = input

    if (!token || !id) {
      throw new CustomError(404, "Você não está autorizado!")
    }

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
      throw new CustomError(404, "Token inválido!")
    }

    const postDB = await this.postDatabase.getPostById(id);

    if (!postDB) {
      throw new NotFoundError();
    }

    if (payload.role === USER_ROLES.NORMAL && payload.id !== postDB.creator) {
      throw new CustomError(404, "Você não está autorizado a apagar ese post!")
    }

    await this.postDatabase.deletePostById(id)

    const result = {
      message: `Post de ID: ${id} foi deletado com sucesso!`
    }

    return result
  }
}