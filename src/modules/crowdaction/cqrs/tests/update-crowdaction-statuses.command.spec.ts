import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model, connect } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    CrowdActionRepository,
    CommitmentPersistence,
    CommitmentSchema,
    CommitmentRepository,
} from '@infrastructure/mongo';
import { ICrowdActionRepository, CrowdActionStatusEnum, CrowdActionJoinStatusEnum } from '@domain/crowdaction';
import { ICommitmentRepository } from '@domain/commitment';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { UpdateCrowdActionStatusesCommand, CreateCrowdActionCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import { SchedulerService } from '@modules/scheduler';

describe('UpdateCrowdActionStatusesCommand', () => {
    let updateCrowdActionStatusesCommand: UpdateCrowdActionStatusesCommand;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        crowdactionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                UpdateCrowdActionStatusesCommand,
                CreateCrowdActionCommand,
                SchedulerService,
                SchedulerRegistry,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
            ],
        }).compile();

        updateCrowdActionStatusesCommand = moduleRef.get<UpdateCrowdActionStatusesCommand>(UpdateCrowdActionStatusesCommand);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
    });

    afterAll(async () => {
        createCrowdActionCommand.stopAllCrons();
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

    describe('updateCrowdActionStatuses', () => {
        it('should create a new crowdAction and then update its statuses', async () => {
            const createdCrowdAction = await createCrowdActionCommand.execute(CreateCrowdActionStub());
            expect(createdCrowdAction).toBeDefined();

            const updatedCrowdAction = await updateCrowdActionStatusesCommand.execute({
                id: createdCrowdAction.id,
                status: CrowdActionStatusEnum.WAITING,
                joinStatus: CrowdActionJoinStatusEnum.CLOSED,
            });
            expect(updatedCrowdAction).toBeDefined();
        });
    });
});

const CreateCrowdActionStub = (): any => {
    return {
        title: 'Crowdaction title',
        description: 'Crowdaction description',
        category: 'FOOD',
        subcategory: 'SUSTAINABILITY',
        country: 'TG',
        password: 'pa$$w0rd',
        startAt: new Date('01/01/2025'),
        endAt: new Date('08/01/2025'),
        joinEndAt: new Date('07/01/2025'),
        badges: [
            {
                tier: BadgeTierEnum.BRONZE,
                awardType: AwardTypeEnum.ALL,
                minimumCheckIns: 12,
            },
        ],
        commitments: [
            {
                label: 'Vegan',
                tags: [],
                points: 50,
                icon: 'magnet_outline',
            },
            {
                label: 'No Dairy',
                tags: [],
                points: 25,
                icon: 'magnet_outline',
            },
        ],
    };
};
