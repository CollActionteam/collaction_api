import { ICommand } from "@common/cqrs";
import { UserRole } from "@domain/auth/enum";
import { ForumPermission, IForumPermissionRepository } from "@domain/forum";
import { AdminForumPermission, ModeratorForumPermission, UserForumPermission } from "@infrastructure/forum";
import { Injectable } from "@nestjs/common";

export interface CreateForumPermissionArgs {
    readonly forumId: string;
    readonly role: UserRole;
    readonly parentId?: string;
    readonly parentList?: string[];
}

@Injectable()
export class CreateForumPermissionCommand implements ICommand<CreateForumPermissionArgs> {
    constructor(private readonly forumPermissionRepository: IForumPermissionRepository) {}

    async execute({ forumId, role, parentId, parentList }: CreateForumPermissionArgs): Promise<ForumPermission> {
        let forumPermission;
        if (parentId || parentList?.length) {
            forumPermission = await this.forumPermissionRepository.findOne({
                query: { role, forumId: { in: [...new Set([parentId, ...(parentList || [])])] } },
                orderBy: [{ field: 'createdAt', direction: 'desc' }],
            });
        }

        if (!forumPermission) {
            switch (role) {
                case UserRole.USER: {
                    forumPermission = await this.forumPermissionRepository.create(UserForumPermission(forumId));
                    break;
                }
                case UserRole.MODERATOR: {
                    forumPermission = await this.forumPermissionRepository.create(ModeratorForumPermission(forumId));
                    break;
                }
                case UserRole.ADMIN: {
                    forumPermission = await this.forumPermissionRepository.create(AdminForumPermission(forumId));
                    break;
                }
            }
        }
        return forumPermission;
    }
}
