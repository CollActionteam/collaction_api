import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IThreadRepository } from '@domain/thread';
import { CreateThreadDto } from '@infrastructure/thread';
import { Identifiable, UserInfo } from '@domain/core';

@Injectable()
export class CreateThreadCommand implements ICommand {
    constructor(private readonly threadRepository: IThreadRepository) {}

    async execute(data: CreateThreadDto): Promise<Identifiable> {
        // TODO: Create actual user info. Either get info from profile or create repo specifically for user info
        const userInfo = new UserInfo();

        return await this.threadRepository.create({
            ...data,
            // TODO: What is firstPost? The first post id?
            firstPost: '',
            author: userInfo,
            closed: false,
            stickied: false,
            visible: true,
            replyCount: 0,
            lastPostInfo: {
                postInfo: { postId: '', title: '', createdAt: new Date(), updatedAt: new Date() },
                userInfo: userInfo,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
