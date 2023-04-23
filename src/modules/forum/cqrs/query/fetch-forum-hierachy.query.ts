import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Forum, IForum, IForumRepository } from '@domain/forum';

@Injectable()
export class GetForumHierarchy implements IQuery<string, IForum[]> {
    constructor(private readonly forumRepository: IForumRepository) {}

    async handle(forumId: string): Promise<IForum[]> {
        // For some reason only works if I add as any? Otherwise the compiler complains
        const forums: Forum[] = await this.forumRepository.findAll({ parentList: { in: [forumId] } as any });
        return forums;
    }
}
