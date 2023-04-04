import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commitment, CreateCommitment, ICommitmentRepository, PatchCommitment, QueryCommitment } from '@domain/commitment';
import { CommitmentDocument, CommitmentPersistence } from '@infrastructure/mongo/persistence';
import { Identifiable } from '@domain/core';
import { FindCriteria, IPagination } from '@core/repository.interface';
import { toMongoQuery } from '../utils/mongo.utils';

@Injectable()
export class CommitmentRepository implements ICommitmentRepository {
    constructor(@InjectModel(CommitmentPersistence.name) private readonly documentModel: Model<CommitmentDocument>) {}

    async create(entityLike: CreateCommitment): Promise<Identifiable> {
        const document = new this.documentModel(entityLike);
        await document.save();

        return { id: document.id };
    }

    async patch(id: string, entityLike: PatchCommitment): Promise<void> {
        await this.documentModel.updateOne({ id }, entityLike);
    }

    async delete(id: string): Promise<void> {
        await this.findOne({ id });
        await this.documentModel.deleteOne({ id });
    }

    async findOne(query: FindCriteria<QueryCommitment>): Promise<Commitment> {
        const [entity] = await this.findAll(query, { offset: 0, limit: 1 });
        return entity;
    }

    async findAll(query: FindCriteria<QueryCommitment>, options?: IPagination): Promise<Commitment[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });

        return documents.map((doc) => Commitment.create(doc.toObject({ getters: true })));
    }

    async count(query: FindCriteria<QueryCommitment>): Promise<number> {
        const mongoQuery = toMongoQuery(query);
        return this.documentModel.count(mongoQuery);
    }
}
