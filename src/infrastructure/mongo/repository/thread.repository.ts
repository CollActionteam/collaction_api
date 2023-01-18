import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread } from '@domain/thread';
import { IThreadRepository, CreateThread, PatchThread, QueryThread } from '@domain/thread/interface';
import { ThreadDocument, ThreadPersistence } from '@infrastructure/mongo/persistence';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class ThreadRepository implements IThreadRepository {
    constructor(@InjectModel(ThreadPersistence.name) private readonly documentModel: Model<ThreadDocument>) {}

    async create(entityLike: CreateThread): Promise<Thread> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return Thread.create(document.toObject({ getters: true }));
    }

    async patch(id: string, entityLike: PatchThread): Promise<void> {
        await this.findOne({ query: { id } });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ query: { id } });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryThread>): Promise<Thread> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryThread>, options?: IPagination): Promise<Thread[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => Thread.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryThread>): Promise<number> {
        const mongoQuery = toMongoQuery(query);
        return this.documentModel.count(mongoQuery);
    }
}
