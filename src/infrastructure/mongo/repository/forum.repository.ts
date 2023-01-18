import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum } from '@domain/forum';
import { IForumRepository, CreateForum, PatchForum, QueryForum } from '@domain/forum/interface';
import { ForumDocument, ForumPersistence } from '@infrastructure/mongo/persistence';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class ForumRepository implements IForumRepository {
    constructor(@InjectModel(ForumPersistence.name) private readonly documentModel: Model<ForumDocument>) {}

    async create(entityLike: CreateForum): Promise<Forum> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return Forum.create(document.toObject({ getters: true }));
    }

    async patch(id: string, entityLike: PatchForum): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryForum>): Promise<Forum> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryForum>, options?: IPagination): Promise<Forum[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => Forum.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryForum>): Promise<number> {
        const mongoQuery = toMongoQuery(query);
        return this.documentModel.count(mongoQuery);
    }
}
