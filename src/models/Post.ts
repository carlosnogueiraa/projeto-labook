export interface PostDB {
    id: string,
    content: string,
    user_id: string
}

export interface LikeDB {
    id: string,
    post_id: string,
    user_id: string
}

export interface inputType {
    token: string,
    post_id: string
}

export class Post {
    constructor(
        private id: string,
        private content: string,
        private userId: string,
        private likes: number = 0
    ) {}

    public getId = ():string => {
        return this.id
    }

    public getContent = ():string => {
        return this.content
    }

    public getUserId = ():string => {
        return this.userId
    }

    public getLikes = ():number => {
        return this.likes
    }

    public setId = (newId: string) => {
        this.id = newId
    }

    public setContent = (newContent: string) => {
        this.content = newContent
    }

    public setUserId = (newUserId: string) => {
        this.userId = newUserId
    }

    public setLikes = (newLikes: number) => {
        this.likes = newLikes
    }
}