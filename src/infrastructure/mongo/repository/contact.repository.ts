import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { Contact, CreateContact, IContactRepository, PatchContact, QueryContact } from '@domain/contact';
import { Identifiable } from '@domain/core';
import { ContactDocument, ContactPersistence } from '../persistence/contact.persistence';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class ContactRepository implements IContactRepository {
    constructor(@InjectModel(ContactPersistence.name) private readonly documentModel: Model<ContactDocument>) {}

    async create(entityLike: CreateContact): Promise<Identifiable> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return { id: document.id };
    }

    async patch(id: string, entityLike: PatchContact): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryContact>): Promise<Contact> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryContact>, options?: IPagination): Promise<Contact[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => Contact.create(doc.toObject({ getters: true })));
    }
}
