import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrowdAction } from '@domain/crowdaction';
import { CreateCrowdAction, ICrowdActionRepository, PatchCrowdAction, QueryCrowdAction } from '@domain/crowdaction/interface';
import { CrowdActionDocument, CrowdActionPersistence } from '@infrastructure/mongo/persistence';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class CrowdActionRepository implements ICrowdActionRepository {
    constructor(@InjectModel(CrowdActionPersistence.name) private readonly documentModel: Model<CrowdActionDocument>) {}

    async create(entityLike: CreateCrowdAction): Promise<CrowdAction> {
        const document = new this.documentModel(entityLike);
        await document.save();

        const crowdAction = CrowdAction.create(document.toObject({ getters: true }));

        return crowdAction;
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
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => CrowdAction.create(doc.toObject({ getters: true })));
    }

    async increment(query: FindCriteria<QueryCrowdAction>, field: string, value: number = 1): Promise<void> {
        const mongoQuery = toMongoQuery(query);
        await this.documentModel.updateMany(mongoQuery, { $inc: { [field]: value } });
    }

    async count(query: FindCriteria<QueryCrowdAction>): Promise<number> {
        const mongoQuery = toMongoQuery(query);
        return this.documentModel.count(mongoQuery);
    }
}
