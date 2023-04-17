import { FindCriteria, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Forum } from '../entity';
import { IForum } from './forum.interface';

export type CreateForum = Omit<IForum, 'id'>;
export type PatchForum = Partial<IForum>;
export type QueryForum = Partial<Pick<IForum, 'id' | 'defaultCrowdActionForum' | 'parentList'>>;

export abstract class IForumRepository implements IRepository<Forum, CreateForum, PatchForum, QueryForum> {
    abstract create(entityLike: CreateForum): Promise<Identifiable>;
    abstract patch(id: string, entityLike: Partial<IForum>): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryForum>): Promise<Forum>;
    abstract findAll(query: FindCriteria<QueryForum>): Promise<Forum[]>;
    abstract count(query: FindCriteria<QueryForum>): Promise<number>;
}
