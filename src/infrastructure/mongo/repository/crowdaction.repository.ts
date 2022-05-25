import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CrowdAction } from '@domain/crowdaction';
import { CreateCrowdAction, ICrowdActionRepository, PatchCrowdAction, QueryCrowdAction } from '@domain/crowdaction/interface';
import { CrowdActionDocument, CrowdActionPersistence } from '@infrastructure/mongo/persistence';
import { Identifiable } from '@domain/core';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class CrowdActionRepository implements ICrowdActionRepository {
    constructor(@InjectModel(CrowdActionPersistence.name) private readonly documentModel: Model<CrowdActionDocument>) {}

    async create(entityLike: CreateCrowdAction): Promise<Identifiable> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return this.findOne({ id: document.id });
    }

    async patch(id: string, entityLike: PatchCrowdAction): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryCrowdAction>): Promise<CrowdAction> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryCrowdAction>, options?: IPagination): Promise<CrowdAction[]> {
        const mongoQuery = toMongoQuery<FilterQuery<CrowdActionDocument>>(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => CrowdAction.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryCrowdAction>): Promise<number> {
        const mongoQuery = toMongoQuery<FilterQuery<CrowdActionDocument>>(query);
        return this.documentModel.count(mongoQuery);
    }
}
