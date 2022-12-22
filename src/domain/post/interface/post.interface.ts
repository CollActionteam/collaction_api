import { IUserInfo } from '@domain/core';

export interface IPost {
    readonly id: string;
    readonly threadId: string;
    readonly forumId: string;
    readonly author: IUserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
