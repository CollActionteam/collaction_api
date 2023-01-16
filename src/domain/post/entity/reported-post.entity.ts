import { IUserInfo } from '@domain/core';
import { ReportStatusEnum } from '../enum/report-status.enum';
import { IPost } from '../interface';

export class ReportedPost implements IPost {
    // Interface variables
    readonly id: string;
    readonly threadId: string;
    readonly forumId: string;
    readonly author: IUserInfo;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly postId: string;
    readonly reason: string;
    readonly handledById?: string;
    readonly status: ReportStatusEnum;
}
