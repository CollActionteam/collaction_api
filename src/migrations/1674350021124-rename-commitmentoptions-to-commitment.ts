import { uuidv4 } from '@firebase/util';
import { Collection } from 'typeorm/driver/mongodb/typings';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { CommitmentDocument } from '@infrastructure/mongo';
import { BaseMigration } from './util/base-migration';

export class renameCommitmentoptionsToCommitment1674350021124 extends BaseMigration {
    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const commitmentsCollection: Collection<CommitmentDocument> = await this.getCollection<CommitmentDocument>(
            queryRunner,
            'commitmentoptions',
        );
        const commitments = await commitmentsCollection.find<CommitmentDocument>({ type: { $exists: true } }).toArray();
        commitments.map(
            async (commitment) =>
                await commitmentsCollection.updateMany(
                    { _id: commitment._id },
                    {
                        $set: {
                            deprecatedId: '$_id',
                            id: uuidv4(),
                        },
                        $rename: { type: 'deprecatedType' },
                    },
                ),
        );
        commitmentsCollection.rename('commitments');
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const commitmentsCollection: Collection<CommitmentDocument> = await this.getCollection<CommitmentDocument>(
            queryRunner,
            'commitments',
        );
        const commitments = await commitmentsCollection.find<CommitmentDocument>({ type: { $exists: true } }).toArray();
        commitments.map(
            async (commitment) =>
                await commitmentsCollection.updateMany(
                    { _id: commitment._id },
                    {
                        $set: { id: '$deprecatedId' },
                        $unset: { deprecatedId: '' },
                        $rename: { deprecatedType: 'type' },
                    },
                ),
        );
        commitmentsCollection.rename('commitmentoptions');
    }
}
