import { uuidv4 } from '@firebase/util';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Collection } from 'typeorm/driver/mongodb/typings';
import { CrowdActionDocument } from '@infrastructure/mongo';
import { BaseMigration } from './util/base-migration';

export class refactorCrowdactionsAndCommitments1674288860796 extends BaseMigration {
    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActionCollection: Collection<CrowdActionDocument> = await this.getCollection<CrowdActionDocument>(
            queryRunner,
            'crowdactions',
        );
        const crowdActions = await crowdActionCollection.find<CrowdActionDocument>({ type: { $exists: true } }).toArray();
        crowdActions.map(
            async (crowdAction) =>
                await crowdActionCollection.updateMany(
                    { _id: crowdAction._id },
                    {
                        $rename: { 'commitmentOptions.$._id': 'deprecatedId', commitmentoptions: 'commitments', type: 'deprecatedType' },
                        $addToSet: { _id: uuidv4() },
                    },
                ),
        );
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActions = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        crowdActions.updateMany(
            { commitments: { $exists: true } },
            {
                $set: { _id: undefined },
                $rename: { 'commitmentOptions.$.deprecatedId': '_id', commitments: 'commitmentoptions', deprecatedType: 'type' },
            },
        );
    }
}
