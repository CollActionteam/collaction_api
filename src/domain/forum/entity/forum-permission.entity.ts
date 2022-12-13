import { UserRole } from '@domain/auth/enum';
import { IForumPermission } from '../interface/forum-permission.interface';

export class ForumPermission implements IForumPermission {
    readonly id: string;
    readonly forumId: string;
    readonly role: UserRole;
    readonly createThreads: boolean;
    readonly createPosts: boolean;
    readonly canLike: boolean;
    readonly canDeleteThreads: boolean;
    readonly canDeleteOwnThreads: boolean;
    readonly canDeletePosts: boolean;
    readonly canDeleteOwnPosts: boolean;
    readonly canEditThreads: boolean;
    readonly canEditPosts: boolean;
    readonly canEditOwnThreads: boolean;
    readonly canEditOwnPosts: boolean;
    readonly canPostPolls: boolean;
    readonly canVotePolls: boolean;
}
