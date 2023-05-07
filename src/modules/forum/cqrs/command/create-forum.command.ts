import { Injectable } from '@nestjs/common';
import { ICommand, ICQRSHandler } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { IForumRepository } from '@domain/forum';
import { CreateForumDto } from '@infrastructure/forum';
import { UserRole } from '@domain/auth/enum';
import { FindForumByIdQuery } from '../query';
import { CreateForumPermissionCommand } from './create-forum-permission.command';

export interface ICreateForumArgs {
    data: CreateForumDto;
    userRole: UserRole;
}

@Injectable()
export class CreateForumCommand implements ICommand {
    constructor(private readonly forumRepository: IForumRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async execute(args: ICreateForumArgs): Promise<Identifiable> {
        let parentList: string[] = [];
        if (args.data.parentId) {
            const parentForum = await this.cqrsHandler.fetch(FindForumByIdQuery, args.data.parentId);
            if (parentForum.parentList) {
                parentList = parentForum.parentList;
            }
            parentList.push(args.data.parentId);
        }

        const forumId = await this.forumRepository.create({
            ...args.data,
            displayOrder: 0,
            threadCount: 0,
            postCount: 0,
            parentList: parentList,
            defaultCrowdActionForum: args.data.isDefault,
        });

        await this.cqrsHandler.execute(CreateForumPermissionCommand, {
            forumId: forumId.id,
            role: args.userRole,
            parentId: args.data.parentId,
            parentList: parentList,
        });

        return forumId;
    }
}
