import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateParticipation,
    IParticipationRepository,
    PatchParticipation,
    QueryParticipation,
} from '@domain/participation/interface/participation-repository.interface';
import { Identifiable } from '@domain/core';
import { Participation } from '@domain/participation';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { ParticipationDocument, ParticipationPersistence } from '../persistence/participation.persistence';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class ParticipationRepository implements IParticipationRepository {
    constructor(@InjectModel(ParticipationPersistence.name) private readonly documentModel: Model<ParticipationDocument>) {}

    async create(entityLike: CreateParticipation): Promise<Identifiable> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return this.findOne({ id: document.id });
    }

    async patch(id: string, entityLike: PatchParticipation): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: QueryParticipation): Promise<Participation> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryParticipation>, options?: IPagination): Promise<Participation[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => Participation.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryParticipation>): Promise<number> {
        const mongoQuery = toMongoQuery(query);
        return this.documentModel.count(mongoQuery);
    }
}
