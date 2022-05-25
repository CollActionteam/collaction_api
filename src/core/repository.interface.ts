import { Identifiable } from '@domain/core';

type PrimitiveTypes = boolean | null | undefined | number | bigint | string;

/**
 * Recursively makes all object's properties and sub-properties optional
 * @param T - [Required] Entry object type
 * @param O - [Optional] If provided overwrites all values' type
 */
export type DeepOptional<T, O = void> = {
    // eslint-disable-next-line prettier/prettier
    [key in keyof T]?: T[key] extends PrimitiveTypes | Date ? (O extends void ? T[key] : O) : DeepOptional<T[key], O>;
};

type Sortable<T> = { sort?: DeepOptional<T> };

export interface IPagination {
    offset?: number;
    limit?: number;
}

export type FindOptions<TSort> = Sortable<TSort> & IPagination;

type ArrayOperators = 'in' | 'nin';
export type FindOperators = 'gte' | 'gt' | 'lt' | 'lte' | 'eq' | ArrayOperators;

export type FindConditions<T> = {
    [key in FindOperators]?: key extends ArrayOperators ? T[] : T;
};

export type FindCriteria<T> = {
    [P in keyof T]?: T[P] extends PrimitiveTypes | Date ? T[P] | FindConditions<T[P]> : FindCriteria<T[P]>;
};

export type FindQueryOrderBy = { field: string; direction: 'asc' | 'desc' };

export type FindQuery<T> = {
    query: FindCriteria<T>;
    orderBy?: FindQueryOrderBy[];
    limit?: number;
    offset?: number;
};

export interface IRepository<TEntity, TCreate, TPatch, TQuery> {
    create(entityLike: TCreate): Promise<Identifiable>;
    patch(id: string, entityLike: TPatch): Promise<void>;
    delete(id: string): Promise<void>;
    findOne(query: FindCriteria<TQuery>): Promise<TEntity>;
    findAll<TSort>(query: FindCriteria<TQuery>, options?: FindOptions<TSort>): Promise<TEntity[]>;
    count?(criteria: FindCriteria<TQuery>): Promise<number>;
}
