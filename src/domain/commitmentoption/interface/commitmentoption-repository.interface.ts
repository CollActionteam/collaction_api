import { FindCriteria, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { CommitmentOption, ICommitmentOption } from '@domain/commitmentoption';

export type CreateCommitmentOption = Omit<ICommitmentOption, 'id' | 'createdAt' | 'updatedAt'>;
export type PatchCommitmentOption = Partial<ICommitmentOption>;
export type QueryCommitmentOption = Partial<Pick<ICommitmentOption, 'id' | 'type'>> & {
    readonly blocks?: string;
};

export abstract class ICommitmentOptionRepository
    implements IRepository<CommitmentOption, CreateCommitmentOption, PatchCommitmentOption, QueryCommitmentOption>
{
    abstract create(entityLike: CreateCommitmentOption): Promise<Identifiable>;
    abstract patch(id: string, entityLike: PatchCommitmentOption): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryCommitmentOption>): Promise<CommitmentOption>;
    abstract findAll(query: FindCriteria<QueryCommitmentOption>): Promise<CommitmentOption[]>;
    abstract count(query: FindCriteria<QueryCommitmentOption>): Promise<number>;
}
