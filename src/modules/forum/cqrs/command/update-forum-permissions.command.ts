import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { IForumPermissionRepository } from '@domain/forum';
import { UpdateForumPermissionDto } from '@infrastructure/forum';

export interface IUpdateForumPermissionArgs {
    forumId: string;
    data: UpdateForumPermissionDto;
}

@Injectable()
export class UpdateForumPermissionsCommand implements ICommand<IUpdateForumPermissionArgs> {
    constructor(private readonly forumPermissionRepository: IForumPermissionRepository) {}

    async execute({ forumId, data }: IUpdateForumPermissionArgs): Promise<Identifiable> {
        const forumPermission = await this.forumPermissionRepository.findOne({ query: { forumId: forumId } });
        await this.forumPermissionRepository.patch(forumPermission.id, { ...data });
        return await this.forumPermissionRepository.findOne({ query: { forumId: forumId } });
    }
}
