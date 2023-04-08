import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CrowdActionPersistence, CrowdActionSchema, CrowdActionRepository } from '@infrastructure/mongo';
import { CrowdAction, ICrowdActionRepository, CrowdActionStatusEnum, CrowdActionJoinStatusEnum } from '@domain/crowdaction';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { UpdateCrowdActionStatusesCommand } from '@modules/crowdaction';
import { SchedulerService } from '../scheduler.service';

describe('SchedulerService', () => {
    let schedulerService: SchedulerService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let schedulerRegistry: SchedulerRegistry;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                SchedulerService,
                {
                    provide: SchedulerRegistry,
                    useValue: {
                        addCronJob: jest.fn(),
                    },
                },
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
            ],
        }).compile();

        schedulerService = moduleRef.get<SchedulerService>(SchedulerService);
        schedulerRegistry = moduleRef.get<SchedulerRegistry>(SchedulerRegistry);
    });

    afterAll(async () => {
        // stop crons here <--
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

    describe('init', () => {
        it('fetch all crowdactions and create cron for each', async () => {
            const crowdAction1 = await new crowdActionModel(CrowdActionStub()).save();
            crowdAction1.id = '928cdea92e19fd912f0d520e';

            schedulerService.createCron(crowdAction1);
            expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(crowdAction1.id, expect.any(CronJob));

            const crowdAction2 = await new crowdActionModel(CrowdActionStub()).save();
            crowdAction2.id = '428cdea92e19fd912f0d520e';

            schedulerService.createCron(crowdAction2);
            expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(crowdAction2.id, expect.any(CronJob));
        });
    });

    describe('createCron', () => {
        it('should correctly execute UpdateCrowdActionStatusCommand and DelegateBadgesCommand based on Crowdaction status', async () => {
            const createCrowdAction = await new crowdActionModel(CrowdActionStub()).save();
            schedulerService.createCron(createCrowdAction);

            // cannot execute UpdateCrowdActionStatusCommand?
            const updatedCrowdAction = await UpdateCrowdActionStatusesCommand.execute({
                ...createCrowdAction,
                id: createCrowdAction.id,
                status: CrowdActionStatusEnum.ENDED,
                joinStatus: CrowdActionJoinStatusEnum.CLOSED,
            });

            expect(updatedCrowdAction.status).toEqual(CrowdActionStatusEnum.ENDED);
            expect(updatedCrowdAction.joinStatus).toEqual(CrowdActionJoinStatusEnum.CLOSED);
        });
        it('should correctly handle a change in join status', async () => {
            const crowdaction = await new crowdActionModel(CrowdActionStub()).save();
            schedulerService.createCron(crowdaction);

            const updateCrowdAction = await UpdateCrowdActionStatusesCommand.execute({
                ...crowdaction,
                id: crowdaction.id,
                status: CrowdActionStatusEnum.ENDED,
                joinStatus: CrowdActionJoinStatusEnum.CLOSED,
            });

            // expect(updateCrowdActionStatuses).toHaveBeenCalledWith(
            //     crowdAction.id,
            //     CrowdActionStatusEnum.STARTED,
            //     CrowdActionJoinStatusEnum.CLOSED,
            // );
        });
    });

    describe('stopAllCrons', () => {
        it('should stop all cron jobs', async () => {
            const newCrowdAction1 = await new crowdActionModel(CrowdActionStub()).save();
            schedulerService.createCron(newCrowdAction1);

            const newCrowdAction2 = await new crowdActionModel(CrowdActionStub()).save();
            schedulerService.createCron(newCrowdAction2);

            schedulerService.stopAllCrons();

            //? it telling me that this.schedulerRegistry is not a function??
            const cronJobs = schedulerRegistry.getCronJobs();
            expect(cronJobs).toHaveLength(2);
            for (const job of cronJobs.values()) {
                expect(job.running).toBe(false);
            }
        });
    });
});

const CrowdActionStub = (): CrowdAction => {
    const crowdActionStubData = {
        id: '628cdea92e19fd912f0d520e',
        title: 'Crowdaction title',
        slug: 'crowdaction-title',
        description: 'Crowdaction description',
        category: 'FOOD',
        subcategory: 'FOOD',
        location: {
            name: 'Togo',
            code: 'TG',
        },
        password: 'pa$$w0rd',
        participantCount: 15,
        images: {
            card: 'TheCard',
            banner: 'TheBanner',
        },
        commitments: [
            {
                id: '1234-1234-1234-1234',
                label: 'TheLabel',
                description: 'The Description',
                tags: [],
                points: 14,
                blocks: ['O9pbPDY3s5e5XwzgwKZtZTDPvLS2'],
                icon: 'accessibility_outline',
                createdAt: new Date(1 - 1 - 2020),
                updatedAt: new Date(1 - 1 - 2020),
            },
        ],
        status: CrowdActionStatusEnum.STARTED,
        joinStatus: CrowdActionJoinStatusEnum.OPEN,
        startAt: new Date(1 - 1 - 2020),
        endAt: new Date(1 - 1 - 2020),
        joinEndAt: new Date(1 - 1 - 2020),
        createdAt: new Date(1 - 1 - 2020),
        updatedAt: new Date(1 - 1 - 2020),
        badges: [
            {
                tier: BadgeTierEnum.BRONZE,
                awardType: AwardTypeEnum.ALL,
                minimumCheckIns: 12,
            },
        ],
        badgeConfig: {
            diamondThreshold: 100,
        },
    };
    return CrowdAction.create(crowdActionStubData);
};
