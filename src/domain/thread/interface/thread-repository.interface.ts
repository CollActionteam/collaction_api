import { FindCriteria, FindQuery, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Thread } from '../entity';
import { IThread } from './thread.interface';

export type CreateThread = Omit<Thread, 'id'>;
export type PatchThread = Partial<IThread>;
export type QueryThread = FindQuery<Partial<Pick<IThread, 'id' | 'prefixId' | 'forumId' | 'author'>>>;

export abstract class IThreadRepository implements IRepository<Thread, CreateThread, PatchThread, QueryThread> {
    abstract create(entityLike: CreateThread): Promise<Identifiable>;
    abstract patch(id: string, entityLike: PatchThread): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryThread>): Promise<Thread>;
    abstract findAll(query: FindCriteria<QueryThread>): Promise<Thread[]>;
    abstract count(criteria: FindCriteria<QueryThread>): Promise<number>;
}
