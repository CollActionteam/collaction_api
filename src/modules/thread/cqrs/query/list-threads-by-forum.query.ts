import { Injectable } from '@nestjs/common';
import { IPaginationQueryArgs, IQuery, paginate } from '@common/cqrs';
import { FindCriteria } from '@core/repository.interface';
import { IPaginatedList } from '@domain/core';
import { IThread, IThreadRepository, QueryThread } from '@domain/thread';

export interface IListTreadByForumArgs {
    forumId: string;
    filter: IPaginationQueryArgs<FindCriteria<QueryThread>>;
}

@Injectable()
export class ListThreadsByForumQuery implements IQuery<IListTreadByForumArgs, IPaginatedList<IThread>> {
    constructor(private readonly threadRepository: IThreadRepository) {}

    async handle(args: IListTreadByForumArgs): Promise<IPaginatedList<IThread>> {
        const filters = { ...args.filter, filter: { ...args.filter.filter, forumId: { eq: args.forumId } } };
        return paginate(filters, this.threadRepository);
    }
}