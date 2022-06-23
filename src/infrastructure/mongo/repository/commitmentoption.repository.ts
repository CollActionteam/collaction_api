import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CommitmentOption } from '@domain/commitmentoption';
import {
    CreateCommitmentOption,
    ICommitmentOptionRepository,
    PatchCommitmentOption,
    QueryCommitmentOption,
} from '@domain/commitmentoption/interface';
import { CommitmentOptionDocument, CommitmentOptionPersistence } from '@infrastructure/mongo/persistence';
import { Identifiable } from '@domain/core';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class CommitmentOptionRepository implements ICommitmentOptionRepository {
    constructor(@InjectModel(CommitmentOptionPersistence.name) private readonly documentModel: Model<CommitmentOptionDocument>) {}

    async create(entityLike: CreateCommitmentOption): Promise<Identifiable> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return { id: document.id };
    }

    async patch(id: string, entityLike: PatchCommitmentOption): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.updateOne({ _id: id }, entityLike, { upsert: true });
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ _id: id });
    }

    async findOne(query: FindCriteria<QueryCommitmentOption>): Promise<CommitmentOption> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryCommitmentOption>, options?: IPagination): Promise<CommitmentOption[]> {
        const mongoQuery = toMongoQuery<FilterQuery<CommitmentOptionDocument>>(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => CommitmentOption.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryCommitmentOption>): Promise<number> {
        const mongoQuery = toMongoQuery<FilterQuery<CommitmentOptionDocument>>(query);
        return this.documentModel.count(mongoQuery);
    }
}
