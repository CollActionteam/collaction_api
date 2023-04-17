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

@Injectable()
export class FindForumByIdQuery implements IQuery<string> {
    constructor(private readonly forumRepository: IForumRepository) {}

    handle(id: string): Promise<Forum> {
        const forum = this.forumRepository.findOne({ id: id });
        return forum;
    }
}
