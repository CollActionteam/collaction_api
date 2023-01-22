import { Collection } from 'typeorm/driver/mongodb/typings';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { CommitmentDocument } from '@infrastructure/mongo';
import { BaseMigration } from './util/base-migration';

export class renameCommitmentoptionsToCommitment1674350021124 extends BaseMigration {
    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const commitmentsCollection: Collection<CommitmentDocument> = await this.getCollection<CommitmentDocument>(
            queryRunner,
            'commitmentOptions',
        );
        commitmentsCollection.rename('commitments');
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const commitmentsCollection: Collection<CommitmentDocument> = await this.getCollection<CommitmentDocument>(
            queryRunner,
            'commitments',
        );
        commitmentsCollection.rename('commitmentOptions');
    }
}
