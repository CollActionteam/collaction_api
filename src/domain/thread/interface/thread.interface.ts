import { ILastPostInfo, IUserInfo } from '@domain/core';

export interface IThread {
    readonly id: string;
    readonly prefixId?: string;
    readonly forumId: string;
    readonly firstPost: string;
    readonly pollId?: string;
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
}
