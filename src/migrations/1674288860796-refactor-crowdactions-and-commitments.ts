import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Collection } from 'typeorm/driver/mongodb/typings';
import { CrowdActionDocument, ParticipationDocument } from '@infrastructure/mongo';
import { BaseMigration } from './util/base-migration';

export class refactorCrowdactionsAndCommitments1674288860796 extends BaseMigration {
    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActionCollection: Collection<CrowdActionDocument> = await this.getCollection<CrowdActionDocument>(
            queryRunner,
            'crowdactions',
        );
        const participationCollection: Collection<ParticipationDocument> = await this.getCollection<ParticipationDocument>(
            queryRunner,
            'participations',
        );
        const crowdActions = await crowdActionCollection.find<CrowdActionDocument>({ type: { $exists: true } }).toArray();
        crowdActions.map(
            async (crowdAction) =>
                await crowdActionCollection.updateMany(
                    { _id: crowdAction._id },
                    {
                        $rename: { commitmentOptions: 'commitments', type: 'deprecatedType' },
                    },
                ),
        );

        const participations = await participationCollection
            .find<ParticipationDocument>({ commitmentOptions: { $exists: true } })
            .toArray();
        participations.map(
            async (participation) =>
                await participationCollection.updateMany(
                    { id: participation.id },
                    {
                        $rename: { commitmentOptions: 'commitments' },
                    },
                ),
        );
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActions = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        crowdActions.updateMany(
            { commitments: { $exists: true } },
            {
                $rename: { commitments: 'commitmentOptions', deprecatedType: 'type' },
            },
        );

        const participations = await this.getCollection<ParticipationDocument>(queryRunner, 'participations');
        participations.updateMany(
            { commitments: { $exists: true } },
            {
                $rename: { commitments: 'commitmentOptions' },
            },
        );
    }
}
