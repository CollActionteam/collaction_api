import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Forum, IForumRepository } from '@domain/forum';

@Injectable()
export class FindDefaultForumQuery implements IQuery<boolean> {
    constructor(private readonly forumRepository: IForumRepository) {}

    handle(isDefaultForum: boolean): Promise<Forum> {
        const forum = this.forumRepository.findOne({ defaultCrowdActionForum: isDefaultForum });
        return forum;
    }
}
