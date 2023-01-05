import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ICrowdActionRepository, CrowdActionTypeEnum, CrowdActionCategoryEnum } from '@domain/crowdaction';
import { CreateCrowdActionCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    CrowdActionRepository,
    CommitmentRepository,
    CommitmentPersistence,
    CommitmentSchema,
} from '@infrastructure/mongo';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { ICommitmentRepository } from '@domain/commitment';
import { GetCommitmentsByType } from '@modules/commitment';
import {
    CrowdActionMustBeInTheFutureError,
    MustEndAfterStartError,
    MustJoinBeforeEndError,
    CategoryAndSubcategoryMustBeDisimilarError,
} from '@modules/crowdaction/errors';
import { CountryMustBeValidError } from '@modules/core';
import { SchedulerService } from '@modules/scheduler';

describe('CreateCrowdActionCommand', () => {
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
                CreateCrowdActionCommand,
                GetCommitmentsByType,
                SchedulerService,
                SchedulerRegistry,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
            ],
        }).compile();

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

    describe('createCrowdAction', () => {
        it('should create a new crowdAction', async () => {
            const crowdAction = await createCrowdActionCommand.execute(CreateCrowdActionStub());
            expect(crowdAction).toBeDefined();
        });
        it('should throw the CrowdActionMustBeInTheFutureError', async () => {
            const stub = CreateCrowdActionStub();
            stub.startAt = new Date('01/01/2022');
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(CrowdActionMustBeInTheFutureError);
        });
        it('should throw the MustEndAfterStartError', async () => {
            const stub = CreateCrowdActionStub();
            stub.startAt = new Date('11/01/2025');
            stub.endAt = new Date('10/01/2025');
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(MustEndAfterStartError);
        });
        it('should throw the MustJoinBeforeEndError', async () => {
            const stub = CreateCrowdActionStub();
            stub.joinEndAt = new Date('09/01/2025');
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(MustJoinBeforeEndError);
        });
        it('should throw the CategoryAndSubcategoryMustBeDisimilarError', async () => {
            const stub = CreateCrowdActionStub();
            stub.subcategory = CrowdActionCategoryEnum.FOOD;
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(CategoryAndSubcategoryMustBeDisimilarError);
        });
        it('should throw the CountryMustBeValidError', async () => {
            const stub = CreateCrowdActionStub();
            stub.country = 'AZERT';
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(CountryMustBeValidError);
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
