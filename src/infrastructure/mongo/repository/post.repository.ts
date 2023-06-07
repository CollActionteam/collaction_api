import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '@domain/post';
import { CreatePost, IPostRepository, PatchPost, QueryPost } from '@domain/post/interface/post-repository.interface';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { PostDocument, PostPersistence } from '../persistence/post.persistence';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class PostRepsotory implements IPostRepository {
    constructor(@InjectModel(PostPersistence.name) private readonly documentModel: Model<PostDocument>) {}

    async findAll(query: FindCriteria<QueryPost>, options?: IPagination): Promise<Post[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });
        return documents.map((doc) => Post.create(doc.toObject({ getters: true })));
    }

    async create(entityLike: CreatePost): Promise<Post> {
        const document = new this.documentModel(entityLike);
        await document.save();

        const post = Post.create(document.toObject({ getters: true }));

        return post;
    }

    async patch(id: string, entityLike: PatchPost): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryPost>): Promise<Post> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }
}
