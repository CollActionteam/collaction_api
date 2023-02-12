import { FindCriteria, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Commitment } from '../entity/commitment.entity';
import { ICommitment } from './commitment.interface';

export type CreateCommitment = Omit<ICommitment, '_id' | 'createdAt' | 'updatedAt'>;
export type PatchCommitment = Partial<ICommitment>;
export type QueryCommitment = Partial<Pick<ICommitment, '_id'>> & {
    readonly blocks?: string;
    readonly tags: string[];
};

export abstract class ICommitmentRepository implements IRepository<Commitment, CreateCommitment, PatchCommitment, QueryCommitment> {
    abstract create(entityLike: CreateCommitment): Promise<Identifiable>;
    abstract patch(id: string, entityLike: PatchCommitment): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryCommitment>): Promise<Commitment>;
    abstract findAll(query: FindCriteria<QueryCommitment>): Promise<Commitment[]>;
    abstract count(query: FindCriteria<QueryCommitment>): Promise<number>;
}
