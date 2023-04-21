import { Injectable } from '@nestjs/common';
import { ForumPermission, IForumPermissionRepository } from '@domain/forum';
import { IQuery } from '@common/cqrs';
import { UserRole } from '@domain/auth/enum';

export interface FindForumPermissionByIdArgs {
    readonly forumId: string;
    readonly role: UserRole;
}

@Injectable()
export class FindForumPermissionByIdQuery implements IQuery<FindForumPermissionByIdArgs> {
    constructor(private readonly forumPermissionRepository: IForumPermissionRepository) {}

    async handle({ forumId, role }: FindForumPermissionByIdArgs): Promise<ForumPermission> {
        let forumPermission = await this.forumPermissionRepository.findOne({
            query: { role, forumId },
            orderBy: [{ field: 'createdAt', direction: 'desc' }],
        });

        return ForumPermission.create(forumPermission);
    }
}