import { Injectable } from '@nestjs/common';
import { ForumPermission, IForumPermissionRepository } from '@domain/forum';
import { IQuery } from '@common/cqrs';
import { UserRole } from '@domain/auth/enum';
import { ForumPermissionDoesNotExistError } from '../errors';

export interface FindForumPermissionByIdArgs {
    readonly forumId: string;
    readonly role: UserRole;
    readonly parentId?: string;
    readonly parentList?: string[];
}

@Injectable()
export class FindForumPermissionByIdQuery implements IQuery<FindForumPermissionByIdArgs> {
    constructor(private readonly forumPermissionRepository: IForumPermissionRepository) {}

    async handle({ forumId, role, parentId, parentList }: FindForumPermissionByIdArgs): Promise<ForumPermission> {
        let [forumPermission] = await this.forumPermissionRepository.findAll({
            query: { role, forumId },
            orderBy: [{ field: 'createdAt', direction: 'desc' }],
        });

        if (!forumPermission && (parentId || parentList?.length)) {
            forumPermission = await this.forumPermissionRepository.findOne({
                query: { role, forumId: { in: [...new Set([parentId, ...(parentList || [])])] } },
                orderBy: [{ field: 'createdAt', direction: 'desc' }],
            });
        }

        if (!forumPermission) {
            // TODO: Default ForumPermission for role
            throw new ForumPermissionDoesNotExistError();
        }

        return ForumPermission.create(forumPermission);
    }
}
