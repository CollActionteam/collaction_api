import { UserRole } from "@domain/auth/enum";
import { CreateForumPermission } from "@domain/forum";

export const UserForumPermission = (forumId: string): CreateForumPermission => {
    return {
        forumId: forumId,
        role: UserRole.USER,
        createThreads: false,
        createPosts: true,
        canLike: true,
        canDeleteThreads: false,
        canDeleteOwnThreads: false,
        canDeletePosts: false,
        canDeleteOwnPosts: true,
        canEditThreads: false,
        canEditPosts: false,
        canEditOwnThreads: false,
        canEditOwnPosts: true,
        canPostPolls: false,
        canVotePolls: true,
    };
};

export const ModeratorForumPermission = (forumId: string): CreateForumPermission => {
    return {
        forumId: forumId,
        role: UserRole.MODERATOR,
        createThreads: true,
        createPosts: true,
        canLike: true,
        canDeleteThreads: false,
        canDeleteOwnThreads: true,
        canDeletePosts: false,
        canDeleteOwnPosts: true,
        canEditThreads: false,
        canEditPosts: false,
        canEditOwnThreads: true,
        canEditOwnPosts: true,
        canPostPolls: true,
        canVotePolls: true,
    };
};

export const AdminForumPermission = (forumId: string): CreateForumPermission => {
    return {
        forumId: forumId,
        role: UserRole.ADMIN,
        createThreads: true,
        createPosts: true,
        canLike: true,
        canDeleteThreads: true,
        canDeleteOwnThreads: true,
        canDeletePosts: true,
        canDeleteOwnPosts: true,
        canEditThreads: true,
        canEditPosts: true,
        canEditOwnThreads: true,
        canEditOwnPosts: true,
        canPostPolls: true,
        canVotePolls: true,
    };
};
