import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { connect, Connection, Model } from 'mongoose';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { ListParticipationsForCrowdActionQuery } from '@modules/participation';
import { ListCrowdActionsQuery } from '@modules/crowdaction';
import { SchedulerService } from '@modules/scheduler';
import { ICrowdActionRepository, CrowdActionStatusEnum } from '@domain/crowdaction';
import { CrowdActionRepository } from '@infrastructure/mongo';
import { CrowdActionService } from '@modules/crowdaction';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';

import { IParticipationRepository } from '@domain/participation';
import {
    CrowdActionSchema,
    CommitmentOptionSchema,
    CommitmentOptionRepository,
    CommitmentOptionPersistence,
    CrowdActionPersistence,
    ParticipationPersistence,
    ParticipationSchema,
    ParticipationRepository,
} from '@infrastructure/mongo';

describe('ListParticipationsForCrowdActionQuery ', () => {
    // let listParticipationsForCrowdActionQuery: ListParticipationsForCrowdActionQuery;
    let listCrowdActionsQuery: ListCrowdActionsQuery;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let participationModel: Model<ParticipationPersistence>;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ListCrowdActionsQuery,
                ListParticipationsForCrowdActionQuery,
                SchedulerService,
                SchedulerRegistry,
                {
                    provide: 'CrowdActionService',
                    useClass: CrowdActionService,
                },
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();

        // listParticipationsForCrowdActionQuery = moduleRef.get<ListParticipationsForCrowdActionQuery>(ListParticipationsForCrowdActionQuery);
        listCrowdActionsQuery = moduleRef.get<ListCrowdActionsQuery>(ListCrowdActionsQuery);
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe('listParticipationsForCrowdActionQuery', () => {
        it('should retrieve a paginated list of participations in a crowdaction', async () => {
            // create 3 crowdActions with all 3 statuses
            const startedCrowdAction = await crowdActionModel.create({
                title: 'started crowdaction',
                description: 'crowdaction wtih the status started',
                status: CrowdActionStatusEnum.STARTED,
            });

            expect(startedCrowdAction.status).toBe(CrowdActionStatusEnum.STARTED);

            const waitingCrowdAction = await crowdActionModel.create({
                title: 'waiting crowdaction',
                description: 'crowdaction wtih the status waiting',
                status: CrowdActionStatusEnum.WAITING,
            });

            expect(waitingCrowdAction.status).toBe(CrowdActionStatusEnum.WAITING);

            const endedCrowdAction = await crowdActionModel.create({
                title: 'ended crowdaction',
                descripion: 'crowdaction with the status ended',
                status: CrowdActionStatusEnum.ENDED,
            });

            expect(endedCrowdAction.status).toBe(CrowdActionStatusEnum.ENDED);

            // create filter
            const FILTER = { status: { in: [CrowdActionStatusEnum.STARTED, CrowdActionStatusEnum.WAITING] } };

            const result = await listCrowdActionsQuery.handle({
                filter: FILTER,
            });

            // expect 2 crowdactions
            expect(result.items.length).toBe(2);
            expect(
                result.items.every(
                    (item) => item.status === CrowdActionStatusEnum.STARTED || item.status === CrowdActionStatusEnum.WAITING,
                ),
            ).toBe(true);
        });
    });
});