import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Forum } from '@domain/forum';
import { ForumRepository } from '@infrastructure/mongo/repository/forum.repository';

@Injectable()
export class FindDefaultForumQuery implements IQuery<boolean> {
    constructor(private readonly forumRepository: ForumRepository) {}

    handle(isDefaultForum: boolean): Promise<Forum> {
        const forum = this.forumRepository.findOne({ defaultCrowdActionForum: isDefaultForum });
        return forum;
    }
}
