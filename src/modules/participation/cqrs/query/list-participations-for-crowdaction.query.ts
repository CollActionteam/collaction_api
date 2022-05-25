import { Injectable } from '@nestjs/common';
import { IPaginationQueryArgs, IQuery, paginate } from '@common/cqrs';
import { FindCriteria } from '@core/repository.interface';
import { IParticipation, IParticipationRepository, QueryParticipation } from '@domain/participation/interface';
import { IPaginatedList } from '@domain/core';

@Injectable()
export class ListParticipationsForCrowdActionQuery implements IQuery<IPaginationQueryArgs<FindCriteria<QueryParticipation>>> {
    constructor(private readonly participationRepository: IParticipationRepository) {}

    async handle(filter: IPaginationQueryArgs<FindCriteria<QueryParticipation>>): Promise<IPaginatedList<IParticipation>> {
        return paginate(filter, this.participationRepository);
    }
}
