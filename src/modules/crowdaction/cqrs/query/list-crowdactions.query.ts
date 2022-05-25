import { Injectable } from '@nestjs/common';
import { IPaginationQueryArgs, IQuery, paginate } from '@common/cqrs';
import { FindCriteria } from '@core/repository.interface';
import { ICrowdAction, ICrowdActionRepository, QueryCrowdAction } from '@domain/crowdaction';
import { IPaginatedList } from '@domain/core';

@Injectable()
export class ListCrowdActionsQuery implements IQuery<IPaginationQueryArgs<FindCriteria<QueryCrowdAction>>, IPaginatedList<ICrowdAction>> {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async handle(filter: IPaginationQueryArgs<FindCriteria<QueryCrowdAction>>): Promise<IPaginatedList<ICrowdAction>> {
        return paginate(filter, this.crowdActionRepository);
    }
}
