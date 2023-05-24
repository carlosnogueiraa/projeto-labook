import { PostDatabase } from "../database/PostDatabase";
import { CreatePostDTO } from "../dtos/CreatePost.dto";
import { DeletePostDTO } from "../dtos/DeletePost.dto";
import { NotFoundError } from "../error/NotFound";
import { LikeDB, Post, inputType } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
    ) {}

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
      throw new Error("Campo token obrigatório!")
    }

    if (content.length < 1 || typeof content !== "string") {
      throw new Error("Parâmetro 'content' inválido!")
    }

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
      throw new Error("Token inválido!")
    }

    const userDB = await this.postDatabase.getUserById(payload.id)

    if (!userDB) {
      throw new NotFoundError("'Id' não encontrado!")
    }

    const id = this.idGenerator.generate()

    const post = new Post(id, content, userDB.id)

    await this.postDatabase.createPost(post)

    const result = {
      message: "Post criado com sucesso!"
    }

    return result
  }

  public editPost = async (input: CreatePostDTO): Promise<void> => {
    const postDB = await this.postDatabase.getPostById(input.token);

    if (!postDB) {
      throw new NotFoundError();
    }

    const alteredPost = new Post(
        input.token, 
        input.content || postDB.content,
        postDB.user_id
        );

    await this.postDatabase.editPost(alteredPost)
  }

  public deletePost = async (input: DeletePostDTO) => {
    const { id, token } = input

    if (!token || !id) {
      throw new Error("Você não está autorizado!")
    }

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
      throw new Error("Token inválido!")
    }

    const postDB = await this.postDatabase.getPostById(id);

    if (!postDB) {
      throw new NotFoundError();
    }

    if (payload.role === USER_ROLES.USER && payload.id !== postDB.user_id) {
      throw new Error("Você não está autorizado a apagar ese post!")
    }

    await this.postDatabase.deletePostById(id)

    const result = {
      message: `Post de ID: ${id} foi deletado com sucesso!`
    }

    return result
  }

  public like = async (input: inputType) => {
    const { token, post_id } = input

    if (!token) {
      throw new Error("Não autorizado!")
    }

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
      throw new Error("Token inválido!")
    } 

    const postExists = await this.postDatabase.getPostById(post_id)

    if (!postExists) {
      throw new NotFoundError("O ID do post inserido não foi encontrado!")
    }

    const likeExists = await this.postDatabase.getLikePost(
      payload.id,
      post_id
    )

    if (likeExists?.length) {
      throw new Error("Você já deu like nessa postagem!")
    }

    const id = this.idGenerator.generate()
    const like: LikeDB = {
      id,
      post_id,
      user_id: payload.id
    }

    await this.postDatabase.like(like)

    const result = {
      message: "Você curtiu a postagem!"
    }

    return result
  }

  public dislike = async (input: inputType) => {
    const { token, post_id } = input

    if (!token) {
      throw new Error("Não autorizado!")
    }

    const payload = this.authenticator.getTokenPayload(token)

    if (!payload) {
      throw new Error("Token inválido!")
    } 

    const postExists = await this.postDatabase.getPostById(post_id)

    if (!postExists) {
      throw new NotFoundError("O ID do post inserido não foi encontrado!")
    }

    const likeExists = await this.postDatabase.getLikePost(
      payload.id,
      post_id
    )

    if (!likeExists?.length) {
      throw new Error("Você não deu like nessa postagem!")
    }

    await this.postDatabase.dislike(payload.id, post_id)

    const result = {
      message: "Você deu dislike nessa postagem!"
    }

    return result
  }
}
