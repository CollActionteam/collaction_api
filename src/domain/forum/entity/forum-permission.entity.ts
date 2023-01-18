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

    constructor(entityLike: IForumPermission) {
        this.id = entityLike.id;
        this.forumId = entityLike.forumId;
        this.role = entityLike.role;
        this.createThreads = entityLike.createThreads;
        this.createPosts = entityLike.createPosts;
        this.canLike = entityLike.canLike;
        this.canDeleteThreads = entityLike.canDeleteThreads;
        this.canDeleteOwnThreads = entityLike.canDeleteOwnThreads;
        this.canDeletePosts = entityLike.canDeletePosts;
        this.canDeleteOwnPosts = entityLike.canDeleteOwnPosts;
        this.canEditThreads = entityLike.canEditThreads;
        this.canEditPosts = entityLike.canEditPosts;
        this.canEditOwnThreads = entityLike.canEditOwnThreads;
        this.canEditOwnPosts = entityLike.canEditOwnPosts;
        this.canPostPolls = entityLike.canPostPolls;
        this.canVotePolls = entityLike.canVotePolls;
    }

    static create(entityLike: IForumPermission): ForumPermission {
        return new ForumPermission(entityLike);
    }
}
