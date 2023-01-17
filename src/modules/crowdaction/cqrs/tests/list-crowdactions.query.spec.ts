import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { CQRSModule } from '@common/cqrs';
import { CrowdActionCategoryEnum, CrowdActionStatusEnum, CrowdActionTypeEnum, ICrowdActionRepository } from '@domain/crowdaction';
import {
    CommitmentOptionPersistence,
    CommitmentOptionRepository,
    CommitmentOptionSchema,
    CrowdActionPersistence,
    CrowdActionRepository,
    CrowdActionSchema,
} from '@infrastructure/mongo';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { SchedulerService } from '@modules/scheduler';
import { AwardTypeEnum, BadgeTierEnum } from '@domain/badge';
import { CreateCrowdActionDto } from '@infrastructure/crowdaction';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';
import { CreateCrowdActionCommand } from '../command';
import { ListCrowdActionsQuery } from '../query';

describe('ListCrowdActionsQuery', () => {
    let listCrowdActionsQuery: ListCrowdActionsQuery;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdactionModel = mongoConnection.model<CrowdActionPersistence>(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentOptionModel = mongoConnection.model<CommitmentOptionPersistence>(
            CommitmentOptionPersistence.name,
            CommitmentOptionSchema,
        );
        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ListCrowdActionsQuery,
                CreateCrowdActionCommand,
                SchedulerService,
                SchedulerRegistry,
                GetCommitmentOptionsByType,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();
        listCrowdActionsQuery = moduleRef.get<ListCrowdActionsQuery>(ListCrowdActionsQuery);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
    });
    afterAll(async () => {
        createCrowdActionCommand.stopAllCrons();
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    it('should be defined', () => {
        expect(listCrowdActionsQuery).toBeDefined();
        expect(createCrowdActionCommand).toBeDefined();
    });
    describe('handle', () => {
        const createdCrowdActions: any = [];
        const numberOfShownItems = 5;
        const numberOfInserts = 10;

        beforeAll(async () => {
            /****Inserts  a number of crowdActions based so it can be later filtered */
            for (let i = 0; i < numberOfInserts; i++) {
                let stub = { ...CrowdActionStub };
                if (i % 2 == 1) stub = { ...CrowdActionStub2 };
                stub.title = stub.title + '_' + i;

                const createResponse = await createCrowdActionCommand.execute(stub);
                createdCrowdActions.push(createResponse);
            }
            expect(createdCrowdActions.length).toEqual(10);
        });
        it('should return a number of crowdactions from page 1 based on the limet set ', async () => {
            const response = await listCrowdActionsQuery.handle({ page: 1, pageSize: numberOfShownItems });
            expect(response).toBeDefined();
            expect(response.pageInfo.pageSize).toEqual(numberOfShownItems);
            expect(response.items.length).toEqual(numberOfShownItems);
            expect(response.pageInfo.totalItems).toEqual(numberOfInserts);
        });
        it('should return a number of crowdactions from page 2 based on the limet set', async () => {
            const response = await listCrowdActionsQuery.handle({ page: 2, pageSize: numberOfShownItems });
            expect(response.items.length).toEqual(numberOfShownItems);

            for (const item of response.items) {
                expect(Number(item.title.split('_')[1])).toBeGreaterThanOrEqual(numberOfShownItems);
            }
        });
        it('should filter crowdactions By Status', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { status: { in: [CrowdActionStatusEnum.WAITING] } },
            });
            expect(response.items.length).toEqual(numberOfInserts);
            for (const item of response.items) {
                expect(item.status).toEqual(CrowdActionStatusEnum.WAITING);
            }
            const response2 = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { status: { in: [CrowdActionStatusEnum.STARTED] } },
            });
            expect(response2.items.length).toEqual(0);
        });
        it('should filter the crowdactions by subCategory', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { subcategory: CrowdActionCategoryEnum.ELECTIRICITY },
            });
            expect(response.items.length).toEqual(numberOfInserts / 2);
            for (const item of response.items) {
                expect(item.subcategory).toEqual(CrowdActionCategoryEnum.ELECTIRICITY);
            }
        });
        it('should filter the crowdactions by Category', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { category: CrowdActionCategoryEnum.FOOD },
            });
            expect(response.items.length).toEqual(numberOfInserts / 2);
            for (const item of response.items) {
                expect(item.category).toEqual(CrowdActionCategoryEnum.FOOD);
            }
        });

        it('should filter the crowdactions by Id', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { id: createdCrowdActions[0].id },
            });
            expect(response.items.length).toEqual(1);
            expect(response.items[0].id).toEqual(createdCrowdActions[0].id);
        });

        it('should return empty array if it did not find the searched entity', async () => {
            const badId = '63bbdbcc211b8fd99435971f';

            const response = await listCrowdActionsQuery.handle({ page: 1, pageSize: numberOfInserts, filter: { id: badId } });
            expect(response.items.length).toEqual(0);
        });
    });
});

const CrowdActionStub: CreateCrowdActionDto = {
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

const CrowdActionStub2: CreateCrowdActionDto = {
    type: CrowdActionTypeEnum.BIKE,
    title: 'Crowdaction title2',
    description: 'Crowdaction description2',
    category: CrowdActionCategoryEnum.ENERGY,
    subcategory: CrowdActionCategoryEnum.ELECTIRICITY,
    country: 'TG',
    password: 'pa$$w0rd',
    startAt: new Date('01/01/2025'),
    endAt: new Date('08/01/2025'),
    joinEndAt: new Date('07/01/2025'),
    badges: [
        {
            tier: BadgeTierEnum.DIAMOND,
            awardType: AwardTypeEnum.ALL,
            minimumCheckIns: 12,
        },
    ],
};
