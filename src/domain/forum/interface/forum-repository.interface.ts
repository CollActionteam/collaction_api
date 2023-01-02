import { FindCriteria, FindOptions, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Forum } from '../entity';
import { IForum } from './forum.interface';

export type CreateForum = Omit<Forum, 'id'>;
export type PatchForum = Partial<IForum>;
export type QueryForum = Partial<Pick<IForum, 'id'>>;

export abstract class IForumRepository implements IRepository<Forum, CreateForum, PatchForum, QueryForum> {
    abstract create(entityLike: CreateForum): Promise<Identifiable>;
    abstract patch(id: string, entityLike: PatchForum): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryForum>): Promise<Forum>;
    abstract findAll<TSort>(query: FindCriteria<QueryForum>, options?: FindOptions<TSort> | undefined): Promise<Forum[]>;
    abstract count(criteria: FindCriteria<QueryForum>): Promise<number>;
}
