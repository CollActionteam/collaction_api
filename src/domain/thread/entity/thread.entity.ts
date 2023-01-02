import { IUserInfo, ILastPostInfo } from '@domain/core';
import { IThread } from '../interface/thread.interface';

export class Thread implements IThread {
    readonly id: string;
    readonly prefixId: string;
    readonly forumId: string;
    readonly firstPost: string;
    readonly pollId?: string | undefined;
    readonly subject: string;
    readonly message: string;
    readonly author: IUserInfo;
    readonly closed: boolean;
    readonly stickied: boolean;
    readonly visible: boolean;
    readonly replyCount: number;
    readonly lastPostInfo: ILastPostInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(entityLike: IThread) {
        this.id = entityLike.id;
        this.prefixId = entityLike.prefixId;
        this.forumId = entityLike.forumId;
        this.firstPost = entityLike.firstPost;
        this.pollId = entityLike.pollId;
        this.subject = entityLike.subject;
        this.message = entityLike.message;
        this.author = entityLike.author;
        this.closed = entityLike.closed;
        this.stickied = entityLike.stickied;
        this.visible = entityLike.visible;
        this.replyCount = entityLike.replyCount;
        this.lastPostInfo = entityLike.lastPostInfo;
        this.createdAt = entityLike.createdAt;
        this.updatedAt = entityLike.updatedAt;
    }

    static create(entityLike: IThread): Thread {
        return new Thread(entityLike);
    }
}
