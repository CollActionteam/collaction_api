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

    async execute(data: CreateThreadDto): Promise<Identifiable> {
        const query: FindCriteria<QueryForumPermission> = {
            query: { forumId: data.forumId },
            orderBy: [{ field: 'createdAt', direction: 'desc' }],
        };
        const [{ users }, forum, forumPermission, threadCount] = await Promise.all([
            this.adminAuth.getUsers([{ uid: data.userId }]),
            this.forumRepository.findOne({ id: data.forumId }),
            this.forumPermissionRepository.findOne(query),
            this.threadRepository.count({ query: { forumId: data.forumId, author: { userId: data.userId } } }),
        ]);
        const userRecord = users[0];
        const user = await this.profileRepository.findOne({ userId: userRecord.uid });
        if (!forum) throw new ForumDoesNotExistError();
        if (!forumPermission && (forum.parentId || forum.parentList?.length)) {
            const parentForumsPermission = await this.forumPermissionRepository.findAll({
                query: { forumId: { in: [...new Set([forum.parentId, ...(forum.parentList || [])])] } },
            });
            const parentForumPermission = parentForumsPermission[parentForumsPermission.length - 1];

            return this.#handleCreateThread(user, userRecord, parentForumPermission, data, '', threadCount);
        }
        return this.#handleCreateThread(user, userRecord, forumPermission, data, '', threadCount);
    }

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
