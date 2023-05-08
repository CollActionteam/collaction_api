import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { IForum, IForumRepository } from '@domain/forum';

@Injectable()
export class FetchAllForums implements IQuery {
    constructor(private readonly forumRepository: IForumRepository) {}

    async handle(): Promise<IForum[]> {
        return this.forumRepository.findAll({});
    }
}
