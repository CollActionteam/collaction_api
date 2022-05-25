import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ProfileDocument, ProfilePersistence } from '@infrastructure/mongo/persistence';
import { Identifiable } from '@domain/core';
import { IPagination } from '@core/repository.interface';
import { CreateProfile, IProfileRepository, PatchProfile, Profile, QueryProfile } from '@domain/profile';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class ProfileRepository implements IProfileRepository {
    constructor(@InjectModel(ProfilePersistence.name) private readonly documentModel: Model<ProfileDocument>) {}

    async create(entityLike: CreateProfile): Promise<Identifiable> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return this.findOne({ id: document.id });
    }

    async patch(id: string, entityLike: PatchProfile): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: QueryProfile): Promise<Profile> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: QueryProfile, options?: IPagination): Promise<Profile[]> {
        const mongoQuery = toMongoQuery(query) as FilterQuery<ProfileDocument>;
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => Profile.create(doc.toObject({ getters: true })));
    }
}
