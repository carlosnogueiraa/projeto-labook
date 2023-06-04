export interface modelLike {
    userId: string,
    postId: string,
    like: number
}

export class LikeDislike {
    constructor(
        private userId: string,
        private postId: string,
        private like: number
    ) {}

    public getLike(): number {
        return this.like
    }

    public getUserId(): string {
        return this.userId
    }

    public getPostId(): string {
        return this.postId
    }
}

