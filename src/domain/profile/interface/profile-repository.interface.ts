import { FindCriteria, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Profile } from '../entity';
import { IProfile } from './profile.interface';

export type CreateProfile = Omit<Profile, 'id'>;
export type PatchProfile = Partial<IProfile>;
export type QueryProfile = Partial<Pick<IProfile, 'id' | 'userId' | 'phone'>>;

export abstract class IProfileRepository implements IRepository<Profile, CreateProfile, PatchProfile, QueryProfile> {
    abstract create(entityLike: CreateProfile): Promise<Identifiable>;
    abstract patch(id: string, entityLike: PatchProfile): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryProfile>): Promise<Profile>;
    abstract findAll(query: FindCriteria<QueryProfile>): Promise<Profile[]>;
}
