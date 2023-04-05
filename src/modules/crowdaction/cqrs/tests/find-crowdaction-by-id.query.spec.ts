import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model, connect } from 'mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICommitmentRepository } from '@domain/commitment';
import { GetCommitmentsByTag } from '@modules/commitment';
import { CQRSModule } from '@common/cqrs';
import { CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdActionRepository } from '@domain/crowdaction';
import { CrowdActionService } from '@modules/crowdaction/service';
import {
    CommitmentPersistence,
    CommitmentRepository,
    CommitmentSchema,
    CrowdActionPersistence,
    CrowdActionRepository,
    CrowdActionSchema,
} from '@infrastructure/mongo';
import { AwardTypeEnum, BadgeTierEnum } from '@domain/badge';
import { CrowdActionDoesNotExist } from '@modules/crowdaction/errors';
import { FindCrowdActionByIdQuery } from '@modules/crowdaction/cqrs';
import { SchedulerService } from '@modules/scheduler';

describe('FindCrowdActionByIdQuery', () => {
    let findCrowdActionByIdQuery: FindCrowdActionByIdQuery;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let commitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdActionModel = mongoConnection.model<CrowdActionPersistence>(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentModel = mongoConnection.model<CommitmentPersistence>(CommitmentPersistence.name, CommitmentSchema);
        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                FindCrowdActionByIdQuery,
                SchedulerService,
                SchedulerRegistry,
                GetCommitmentsByTag,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
                { provide: CrowdActionService.name, useClass: CrowdActionService },
            ],
        }).compile();
        findCrowdActionByIdQuery = moduleRef.get<FindCrowdActionByIdQuery>(FindCrowdActionByIdQuery);
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
    it('should be defined', () => {
        expect(findCrowdActionByIdQuery).toBeDefined();
    });
    describe('handle', () => {
        it('should return a crowdaction by Id', async () => {
            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub);

            const response = await findCrowdActionByIdQuery.handle(crowdactionDocument.id);
            expect(response).toBeDefined();
            expect(response.commitments).toBeDefined();

            expect(response.id).toEqual(crowdactionDocument.id);
            expect({
                title: response.title,
                description: response.description,
                category: response.category,
                subcategory: response.subcategory,
                country: response.location?.code,
                password: response.password,
            }).toEqual({
                title: CreateCrowdActionStub.title,
                description: CreateCrowdActionStub.description,
                category: CreateCrowdActionStub.category,
                subcategory: CreateCrowdActionStub.subcategory,
                country: CreateCrowdActionStub.country.toUpperCase(),
                password: CreateCrowdActionStub.password,
            });

            expect(response.badges).toEqual(CreateCrowdActionStub.badges);
        });

        it('should throw an error if crowdaction not found', async () => {
            try {
                const badId = '63bbdbcc211b8fd99435971f';
                await findCrowdActionByIdQuery.handle(badId);

                fail('Should have thrown an error');
            } catch (e) {
                expect(e.message).toEqual(new CrowdActionDoesNotExist().message);
            }
        });
    });
});

const CreateCrowdActionStub: any = {
    title: 'Crowdaction title',
    description: 'Crowdaction description',
    category: 'FOOD',
    subcategory: 'SUSTAINABILITY',
    country: 'NL',
    location: {
        code: 'NL',
        name: 'Netherlands',
    },
    password: 'pa$$w0rd',
    slug: 'crowdaction-title',
    startAt: new Date('01/01/2025'),
    endAt: new Date('08/01/2025'),
    joinEndAt: new Date('07/07/2025'),
    joinStatus: CrowdActionJoinStatusEnum.OPEN,
    status: CrowdActionStatusEnum.STARTED,
    participantCount: 0,
    commitments: [],
    badges: [
        {
            tier: BadgeTierEnum.BRONZE,
            awardType: AwardTypeEnum.ALL,
            minimumCheckIns: 12,
        },
    ],
    badgeConfig: {
        diamondThreshold: 90,
    },
    images: {
        card: 'card-image',
        banner: 'banner-image',
    },
};
