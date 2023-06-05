import { IUserInfo } from '@domain/core';
import { IPost } from '../interface/post.interface';

export class Post implements IPost {
    // Interface variables
    readonly id: string;
    readonly threadId: string;
    readonly forumId: string;
    readonly author: IUserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly subject: string;
    readonly message: string;
    readonly visible: boolean;

    constructor(entityLike: Post) {
        this.id = entityLike.id;
        this.threadId = entityLike.threadId;
        this.forumId = entityLike.forumId;
        this.author = entityLike.author;
        this.createdAt = entityLike.createdAt;
        this.updatedAt = entityLike.updatedAt;
        this.subject = entityLike.subject;
        this.message = entityLike.message;
        this.visible = entityLike.visible;
    }

    static create(entityLike: Post): Post {
        return new Post(entityLike);
    }
}
