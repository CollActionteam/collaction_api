import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForumPermission } from '@domain/forum';
import { IForumPermissionRepository, CreateForumPermission, PatchForumPermission, QueryForumPermission } from '@domain/forum/interface';
import { ForumPermissionDocument, ForumPermissionPersistence } from '@infrastructure/mongo/persistence';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class ForumPermissionRepository implements IForumPermissionRepository {
    constructor(@InjectModel(ForumPermissionPersistence.name) private readonly documentModel: Model<ForumPermissionDocument>) {}

    async create(entityLike: CreateForumPermission): Promise<ForumPermission> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return ForumPermission.create(document.toObject({ getters: true }));
    }

    async patch(id: string, entityLike: PatchForumPermission): Promise<void> {
        await this.findOne({ query: { id } });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ query: { id } });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryForumPermission>): Promise<ForumPermission> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryForumPermission>, options?: IPagination): Promise<ForumPermission[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => ForumPermission.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryForumPermission>): Promise<number> {
        const mongoQuery = toMongoQuery(query);
        return this.documentModel.count(mongoQuery);
    }
}
