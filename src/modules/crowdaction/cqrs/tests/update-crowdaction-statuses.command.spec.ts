import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model, connect } from 'mongoose';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    CrowdActionRepository,
    CommitmentOptionPersistence,
    CommitmentOptionSchema,
    CommitmentOptionRepository,
} from '@infrastructure/mongo';
import {
    ICrowdActionRepository,
    CrowdActionTypeEnum,
    CrowdActionCategoryEnum,
    CrowdActionStatusEnum,
    CrowdActionJoinStatusEnum,
} from '@domain/crowdaction';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { UpdateCrowdActionStatusesCommand, CreateCrowdActionCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';

describe('UpdateCrowdActionStatusesCommand', () => {
    let updateCrowdActionStatusesCommand: UpdateCrowdActionStatusesCommand;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        crowdactionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                UpdateCrowdActionStatusesCommand,
                CreateCrowdActionCommand,
                GetCommitmentOptionsByType,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();

        updateCrowdActionStatusesCommand = moduleRef.get<UpdateCrowdActionStatusesCommand>(UpdateCrowdActionStatusesCommand);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
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

    describe('updateCrowdActionStatuses', () => {
        it('should create a new crowdAction and then update its statuses', async () => {
            const createdCrowdActionId = await createCrowdActionCommand.execute(CreateCrowdActionStub());
            expect(createdCrowdActionId).not.toBeUndefined();

            const updatedCrowdActionId = await updateCrowdActionStatusesCommand.execute({
                id: createdCrowdActionId.id,
                status: CrowdActionStatusEnum.WAITING,
                joinStatus: CrowdActionJoinStatusEnum.CLOSED,
            });
            expect(updatedCrowdActionId).not.toBeUndefined();
        });
    });
});

const CreateCrowdActionStub = (): any => {
    return {
        type: CrowdActionTypeEnum.FOOD,
        title: 'Crowdaction title',
        description: 'Crowdaction description',
        category: CrowdActionCategoryEnum.FOOD,
        subcategory: CrowdActionCategoryEnum.SUSTAINABILITY,
        country: 'TG',
        password: 'pa$$w0rd',
        images: {
            card: 'TheCard',
            banner: 'TheBanner',
        },
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
    };
};
