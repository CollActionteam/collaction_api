import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CrowdAction, ICrowdActionRepository, CrowdActionStatusEnum, CrowdActionJoinStatusEnum } from '@domain/crowdaction';
import { CrowdActionPersistence, CrowdActionRepository, CrowdActionSchema } from '@infrastructure/mongo';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { CommitmentIconEnum } from '@domain/commitment/enum/commitment.enum';
import { CrowdActionService } from '../service';
import { CrowdActionDoesNotExist } from '../errors';

describe('CrowdActionService', () => {
    let crowdActionService: CrowdActionService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CrowdActionService,
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
            ],
        }).compile();

        crowdActionService = moduleRef.get<CrowdActionService>(CrowdActionService);
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

    describe('findByIdOrFail', () => {
        it('should find a crowdAction using an id or fail', async () => {
            const newCrowdAction = await new crowdActionModel(CrowdActionStub()).save();
            const foundCrowdAction: CrowdAction = await crowdActionService.findByIdOrFail(newCrowdAction.id);
            expect(newCrowdAction.id).toBe(foundCrowdAction.id);
        });
        it('should return CrowdActionDoesNotExist', async () => {
            await new crowdActionModel(CrowdActionStub()).save();
            await expect(crowdActionService.findByIdOrFail('628cdea92e19fd912f0d520e')).rejects.toThrow(CrowdActionDoesNotExist);
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
                _id: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
                tags: [],
                label: 'TheLabel',
                description: 'TheDescription',
                points: 14,
                blocks: ['O9pbPDY3s5e5XwzgwKZtZTDPvLS2'],
                icon: CommitmentIconEnum.no_beef,
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
                icon: 'accessibility_outline',
                minimumCheckIns: 12,
            },
        ],
    };
    return CrowdAction.create(crowdActionStubData);
};
