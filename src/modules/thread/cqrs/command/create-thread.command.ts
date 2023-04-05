import { Injectable } from '@nestjs/common';
import { ICommand, ICQRSHandler } from '@common/cqrs';
import { IThreadRepository } from '@domain/thread';
import { CreateThreadDto } from '@infrastructure/thread';
import { Identifiable } from '@domain/core';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { UserInfo } from '@domain/user-info';

@Injectable()
export class CreateThreadCommand implements ICommand {
    constructor(private readonly threadRepository: IThreadRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async execute(data: CreateThreadDto): Promise<Identifiable> {
        const profile = await this.cqrsHandler.fetch(FindProfileByUserIdQuery, data.userId);
        const userInfo = new UserInfo(profile);

        // TODO: Make Create Post command here for the first post in the new thread.
        // Issue https://github.com/CollActionteam/collaction_api/issues/90

        return await this.threadRepository.create({
            ...data,
            firstPost: 'oj3rbgtbr2ojeuir2vdq',
            author: userInfo,
            closed: false,
            stickied: false,
            visible: true,
            replyCount: 0,
            lastPostInfo: {
                postInfo: { postId: 'jojewngovnorw', title: 'Last Post Title', createdAt: new Date(), updatedAt: new Date() },
                userInfo: userInfo,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
