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
}
