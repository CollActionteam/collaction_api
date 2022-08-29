import { FindCriteria, IRepository } from '@core/repository.interface';
import { Identifiable } from '@domain/core';
import { Contact } from '../entity/contact.entity';
import { IContact } from './contact.interface';

export type CreateContact = Omit<Contact, 'id'>;
export type PatchContact = Partial<IContact>;
export type QueryContact = Partial<Pick<IContact, 'id'>>;

export abstract class IContactRepository implements IRepository<Contact, CreateContact, PatchContact, QueryContact> {
    abstract create(entityLike: CreateContact): Promise<Identifiable>;
    abstract patch(id: string, entityLike: PatchContact): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryContact>): Promise<Contact>;
    abstract findAll(query: FindCriteria<QueryContact>): Promise<Contact[]>;
}
