import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { ICommand } from '@common/cqrs';
import { IProfileRepository, Profile } from '@domain/profile';
import { ForumPermission, IForumPermissionRepository, IForumRepository, QueryForumPermission } from '@domain/forum';
import { IThreadRepository } from '@domain/thread';
import { FirebaseAuthAdmin } from '@infrastructure/auth';
import { CreateThreadDto } from '@infrastructure/thread';
import { Identifiable, IUserInfo } from '@domain/core';
import { ForumDoesNotExistError, UserCannotCreateThreadInForumError } from '@modules/thread/errors';
import { FindCriteria } from '@core/repository.interface';

@Injectable()
export class CreateThreadCommand implements ICommand {
    constructor(
        private readonly adminAuth: FirebaseAuthAdmin,
        private readonly profileRepository: IProfileRepository,
        private readonly forumRepository: IForumRepository,
        private readonly forumPermissionRepository: IForumPermissionRepository,
        private readonly threadRepository: IThreadRepository,
    ) {}

    /**
     *
     * @param data the thread DTO
     * @returns the ID of the newly created thread in an object
     */
    async execute(data: CreateThreadDto): Promise<Identifiable> {
        const query: FindCriteria<QueryForumPermission> = {
            query: { forumId: data.forumId },
            orderBy: [{ field: 'createdAt', direction: 'desc' }],
        };
        const [user, { users: userRecords }, forum, forumPermission, threadCount] = await Promise.all([
            this.profileRepository.findOne({ userId: data.userId }),
            this.adminAuth.getUsers([{ uid: data.userId }]),
            this.forumRepository.findOne({ id: data.forumId }),
            this.forumPermissionRepository.findOne(query),
            this.threadRepository.count({ query: { forumId: data.forumId, author: { userId: data.userId } } }),
        ]);
        const userRecord = userRecords[0];

        // Check if the forum exists
        if (!forum) throw new ForumDoesNotExistError();

        // Check if the forum doesn't have a permission
        if (!forumPermission && (forum.parentId || forum.parentList?.length)) {
            // Use parent forum permission if the forum doesn't have its permission
            const query: FindCriteria<QueryForumPermission> = {
                query: { forumId: { in: [...new Set([forum.parentId, ...(forum.parentList || [])])] } },
                orderBy: [{ field: 'createdAt', direction: 'desc' }],
            };
            const parentForumPermission = await this.forumPermissionRepository.findOne(query);

            // Create a new thread using parent forum permission
            return this.#handleCreateThread(user, userRecord, parentForumPermission, data, '', threadCount);
        }

        // Create a new thread using its forum permission
        return this.#handleCreateThread(user, userRecord, forumPermission, data, '', threadCount);
    }

    /**
     * Private function for handling thread creation.
     *
     * @param user the user profile object
     * @param userRecord the user record coming from firebase
     * @param forumPermission the forum permission
     * @param param3 the thread DTO
     * @param firstPost the ID of the first post in the forum
     * @param threadCount total number of threads in the forum
     * @returns the ID of the newly created thread in an object
     */
    async #handleCreateThread(
        user: Profile,
        userRecord: UserRecord,
        forumPermission: ForumPermission | undefined,
        { userId, forumId, prefixId, subject, message }: CreateThreadDto,
        firstPost: string,
        threadCount: number,
    ) {
        const cannotCreateThread = forumPermission?.role !== userRecord?.customClaims?.role;
        if (cannotCreateThread) throw new UserCannotCreateThreadInForumError();
        const author: IUserInfo = {
            userId,
            fullName: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            threadCount,
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
