import { FindCriteria, IRepository } from '@core/repository.interface';
import { IPaginatedList } from '@domain/core';
import { IPaginationQueryArgs } from './cqrs.interface';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 15;

export const paginate = async <P, A, G, E>(
    { filter = {}, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, sort = {} }: IPaginationQueryArgs<FindCriteria<E>>,
    repository: IRepository<P, A, G, E>,
): Promise<IPaginatedList<P>> => {
    const [items, totalItems = 0] = await Promise.all([
        repository.findAll(filter, {
            limit: pageSize,
            offset: (page - 1) * pageSize,
            sort,
        }),
        repository.count && repository.count(filter),
    ]);

    return {
        items,
        pageInfo: {
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            page,
            pageSize,
        },
    };
};
