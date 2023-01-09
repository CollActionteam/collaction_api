import { Injectable } from '@nestjs/common';
import { ICQRSHandler, IPaginationQueryArgs, IQuery, paginate } from '@common/cqrs';
import { FindCriteria } from '@core/repository.interface';
import { ICrowdAction, ICrowdActionRepository, QueryCrowdAction } from '@domain/crowdaction';
import { IPaginatedList } from '@domain/core';
import { GetParticipationsForUserQuery } from '@modules/participation/cqrs';

export interface IListCrowdActionsForUserArgs {
    userId: string;
    filter: IPaginationQueryArgs<FindCriteria<QueryCrowdAction>>;
}

@Injectable()
export class ListCrowdActionsForUserQuery implements IQuery<IListCrowdActionsForUserArgs, IPaginatedList<ICrowdAction>> {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async handle(args: IListCrowdActionsForUserArgs): Promise<IPaginatedList<ICrowdAction>> {
        const participations = await this.cqrsHandler.fetch(GetParticipationsForUserQuery, args.userId);

        const crowdActionIds = participations.map((p) => p.crowdActionId);
        const filters = { ...args.filter, filter: { ...args.filter.filter, id: { in: crowdActionIds } }, sort: { endAt: 'DESC' } };

        return await paginate(filters, this.crowdActionRepository);
    }
}
