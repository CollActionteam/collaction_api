import { Injectable } from '@nestjs/common';
import { ICQRSHandler, ICommand } from '@common/cqrs';
import { Profile } from '@domain/profile';
import { ForumPermission } from '@domain/forum';
import { IThreadRepository } from '@domain/thread';
import { CreateThreadDto } from '@infrastructure/thread';
import { Identifiable, IUserInfo } from '@domain/core';
import { ForumDoesNotExistError, UserCannotCreateThreadInForumError } from '@modules/thread/errors';
import { FindForumByIdQuery, FindForumPermissionByIdQuery } from '@modules/forum';
import { AuthUser } from '@domain/auth/entity';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';

@Injectable()
export class CreateThreadCommand implements ICommand {
    constructor(private readonly cqrsHandler: ICQRSHandler, private readonly threadRepository: IThreadRepository) {}

    /**
     *
     * @param data the create thread dto
     * @returns the ID of the newly created thread in an object
     */
    async execute({ authUser, ...data }: CreateThreadDto): Promise<Identifiable> {
        const [profile, forum] = await Promise.all([
            this.cqrsHandler.fetch(FindProfileByUserIdQuery, authUser.uid),
            this.cqrsHandler.fetch(FindForumByIdQuery, data.forumId),
        ]);

        // Check if the forum exists
        if (!forum) throw new ForumDoesNotExistError();

        const forumPermission = await this.cqrsHandler.fetch(FindForumPermissionByIdQuery, {
            forumId: data.forumId,
            role: authUser.customClaims.role,
            parentId: forum.parentId,
            parentList: forum.parentList,
        });

        // Create a new thread using its forum permission
        return this.#handleCreateThread(profile, forumPermission, authUser, data, '');
    }

    /**
     * Private function for handling thread creation.
     *
     * @param profile the user profile object
     * @param forumPermission the forum permission
     * @param authUser the current user object
     * @param param3 the thread DTO
     * @param firstPost the ID of the first post in the forum
     * @param threadCount total number of threads in the forum
     * @returns the ID of the newly created thread in an object
     */
    async #handleCreateThread(
        profile: Profile,
        forumPermission: ForumPermission | undefined,
        authUser: AuthUser,
        { forumId, prefixId, subject, message }: Omit<CreateThreadDto, 'authUser'>,
        firstPost: string,
    ) {
        if (forumPermission?.role !== authUser.customClaims?.role) throw new UserCannotCreateThreadInForumError();

        const author: IUserInfo = {
            userId: authUser.uid,
            fullName: `${profile.firstName} ${profile.lastName}`,
            avatar: profile.avatar,
            threadCount: 0,
            postCount: 0,
        };

        return await this.threadRepository.create({
            forumId,
            prefixId,
            firstPost,
            subject,
            message,
            author,
            closed: false,
            stickied: false,
            visible: true,
            replyCount: 0,
            lastPostInfo: {
                postInfo: { postId: '', title: '', createdAt: new Date(), updatedAt: new Date() },
                userInfo: author,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
