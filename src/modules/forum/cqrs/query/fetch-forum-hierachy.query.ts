import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { IForum, IForumRepository } from '@domain/forum';

@Injectable()
export class getForumHierachy implements IQuery<string, IForum[]> {
    constructor(private readonly forumRepository: IForumRepository) {}

    async handle(forumId: string): Promise<IForum[]> {
        return this.forumRepository.findAll({ parentList: [forumId] });
    }
}
