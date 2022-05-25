import { FindCriteria, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Participation } from '../entity';
import { IParticipation } from './participation.interface';

export type CreateParticipation = Omit<Participation, 'id'>;
export type PatchParticipation = Partial<IParticipation>;
export type QueryParticipation = Partial<Pick<IParticipation, 'id' | 'crowdActionId' | 'userId'>>;

export abstract class IParticipationRepository
    implements IRepository<Participation, CreateParticipation, PatchParticipation, QueryParticipation>
{
    abstract create(entityLike: CreateParticipation): Promise<Identifiable>;
    abstract patch(id: string, entityLike: Partial<IParticipation>): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryParticipation>): Promise<Participation>;
    abstract findAll(query: FindCriteria<QueryParticipation>): Promise<Participation[]>;
    abstract count(query: FindCriteria<QueryParticipation>): Promise<number>;
}
