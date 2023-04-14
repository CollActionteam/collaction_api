
import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { IForumRepository } from '@domain/forum';
import { ForumDto } from '@infrastructure/forum';

@Injectable()
export class CreateForumCommand implements ICommand {
    constructor(private readonly forumRepository: IForumRepository) {}

    async execute(data: ForumDto): Promise<Identifiable> {
        const forumId = await this.forumRepository.create({
            ...data,
            defaultCrowdActionForum: true,
        });
        return forumId;
    }
}
