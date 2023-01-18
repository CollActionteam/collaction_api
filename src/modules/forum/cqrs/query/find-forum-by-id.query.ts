import { Injectable } from '@nestjs/common';
import { Forum, IForumRepository } from '@domain/forum';
import { IQuery } from '@common/cqrs';
import { ForumDoesNotExistError } from '../errors';

@Injectable()
export class FindForumByIdQuery implements IQuery<string> {
    constructor(private readonly forumRepository: IForumRepository) {}

    async handle(id: string): Promise<Forum> {
        const [forum] = await this.forumRepository.findAll({ id });

        if (!forum) {
            throw new ForumDoesNotExistError();
        }

        return Forum.create(forum);
    }
}
