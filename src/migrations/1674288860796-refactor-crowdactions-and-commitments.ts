import { CrowdActionDocument } from '@infrastructure/mongo';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Collection } from 'typeorm/driver/mongodb/typings';
import { BaseMigration } from './util/base-migration';

export class refactorCrowdactionsAndCommitments1674288860796 extends BaseMigration {
    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActionCollection: Collection<CrowdActionDocument> = await this.getCollection<CrowdActionDocument>(
            queryRunner,
            'crowdactions',
        );
        const crowdActions = await crowdActionCollection.find<CrowdActionDocument>({ type: { $exists: true } }).toArray();
        crowdActions.map(
            async (crowdAction) => await crowdActionCollection.updateOne({ _id: crowdAction._id }, { $set: { type: undefined } }),
        );
        crowdActions.map(
            async (crowdAction) =>
                await crowdActionCollection.updateOne({ _id: crowdAction._id }, { $rename: { commitmentOptions: 'commitments' } }),
        );
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActions = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        crowdActions.updateMany({ commitments: { $exists: true } }, { $rename: { commitments: 'commitmentOptions' } });
        // Not sure what to do for the other scenario? If we've deleted type how can we get it back?
    }
}
