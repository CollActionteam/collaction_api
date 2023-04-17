
import { Injectable } from '@nestjs/common';
import { ICommand, ICQRSHandler } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { IForumRepository } from '@domain/forum';
import { CreateForumDto } from '@infrastructure/forum';
import { FindForumByIdQuery } from '../query';

export interface ICreateForumArgs {
    data: CreateForumDto;
    isDefault: boolean;
}

@Injectable()
export class CreateForumCommand implements ICommand {
    constructor(private readonly forumRepository: IForumRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async execute(args: ICreateForumArgs): Promise<Identifiable> {
        let parentList: string[] = [];
        if (args.data.parentId) {
            const forum = await this.cqrsHandler.fetch(FindForumByIdQuery, args.data.parentId);
            if (forum.parentList) {
                parentList = forum.parentList;
            }
            parentList.push(args.data.parentId);
        }

        

        const forumId = await this.forumRepository.create({
            ...args.data,
            displayOrder: 0,
            threadCount: 0,
            postCount: 0,
            parentList: parentList,
            visible: true,
            defaultCrowdActionForum: args.isDefault,
        });
        return forumId;
    }
}
