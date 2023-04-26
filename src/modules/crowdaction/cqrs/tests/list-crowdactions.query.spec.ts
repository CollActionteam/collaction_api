import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { ICommitmentRepository } from '@domain/commitment';
import { GetCommitmentsByTag } from '@modules/commitment';
import { CQRSModule } from '@common/cqrs';
import { CrowdAction, CrowdActionStatusEnum, ICrowdActionRepository } from '@domain/crowdaction';
import {
    CommitmentPersistence,
    CommitmentRepository,
    CommitmentSchema,
    CrowdActionPersistence,
    CrowdActionRepository,
    CrowdActionSchema,
    ForumPermissionPersistence,
    ForumPermissionRepository,
    ForumPermissionSchema,
    ForumPersistence,
    ForumRepository,
    ForumSchema,
    ProfilePersistence,
    ProfileRepository,
    ProfileSchema,
    ThreadPersistence,
    ThreadRepository,
    ThreadSchema,
} from '@infrastructure/mongo';
import { AwardTypeEnum, BadgeTierEnum } from '@domain/badge';
import { CreateCrowdActionDto } from '@infrastructure/crowdaction';
import { CreateCrowdActionCommand, ListCrowdActionsQuery } from '@modules/crowdaction/cqrs';
import { UserRole } from '@domain/auth/enum';
import { CreateForumCommand, CreateForumPermissionCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery, ICreateForumArgs } from '@modules/forum';
import { ForumTypeEnum, IForumPermissionRepository, IForumRepository } from '@domain/forum';
import { CreateThreadCommand } from '@modules/thread';
import { IThreadRepository } from '@domain/thread';
import { CreateProfileCommand, FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { IProfileRepository } from '@domain/profile';
import { ProfileService } from '@modules/profile';
import { CreateProfileDto } from '@infrastructure/profile';

describe('ListCrowdActionsQuery', () => {
    let listCrowdActionsQuery: ListCrowdActionsQuery;
    let createForumCommand: CreateForumCommand;
    let createProfileCommand: CreateProfileCommand;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentModel: Model<CommitmentPersistence>;
    let forumPersistenceModel: Model<ForumPersistence>;
    let forumPermissionPersistenceModel: Model<ForumPermissionPersistence>;
    let threadPersistenceModel: Model<ThreadPersistence>;
    let profileModel: Model<ProfilePersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdactionModel = mongoConnection.model<CrowdActionPersistence>(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentModel = mongoConnection.model<CommitmentPersistence>(CommitmentPersistence.name, CommitmentSchema);
        forumPersistenceModel = mongoConnection.model(ForumPersistence.name, ForumSchema);
        forumPermissionPersistenceModel = mongoConnection.model(ForumPermissionPersistence.name, ForumPermissionSchema);
        threadPersistenceModel = mongoConnection.model(ThreadPersistence.name, ThreadSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ListCrowdActionsQuery,
                CreateCrowdActionCommand,
                CreateForumCommand,
                CreateThreadCommand,
                FindForumPermissionByIdQuery,
                FindDefaultForumQuery,
                CreateForumPermissionCommand,
                GetCommitmentsByTag,
                CreateProfileCommand,
                FindProfileByUserIdQuery,
                ProfileService,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: IForumRepository, useClass: ForumRepository },
                { provide: IForumPermissionRepository, useClass: ForumPermissionRepository },
                { provide: IThreadRepository, useClass: ThreadRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
                { provide: getModelToken(ForumPersistence.name), useValue: forumPersistenceModel },
                { provide: getModelToken(ForumPermissionPersistence.name), useValue: forumPermissionPersistenceModel },
                { provide: getModelToken(ThreadPersistence.name), useValue: threadPersistenceModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
            ],
        }).compile();
        listCrowdActionsQuery = moduleRef.get<ListCrowdActionsQuery>(ListCrowdActionsQuery);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
        createForumCommand = moduleRef.get<CreateForumCommand>(CreateForumCommand);
        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);

        // Create a default forum so create crowdaction works.
        await createForumCommand.execute(CreateForumStub());
    });
    afterAll(async () => {
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
            await createProfileCommand.execute(CreateProfileStub());
            /****Inserts  a number of crowdActions based so it can be later filtered */
            for (let i = 0; i < numberOfInserts; i++) {
                const stub = { ...(i % 2 == 1 ? CrowdActionStub2 : CrowdActionStub) };
                stub.title = stub.title + '_' + i;

                const createResponse = await createCrowdActionCommand.execute({
                    userId: CreateProfileStub().userId,
                    userRole: UserRole.ADMIN,
                    crowdActionDto: stub,
                });
                createdCrowdActions.push(createResponse);
            }
            expect(createdCrowdActions.length).toEqual(10);
        });
        it('should return a number of crowdactions from page 1 based on the limit set ', async () => {
            const response = await listCrowdActionsQuery.handle({ page: 1, pageSize: numberOfShownItems });
            expect(response).toBeDefined();
            expect(response.pageInfo.pageSize).toEqual(numberOfShownItems);
            expect(response.items.length).toEqual(numberOfShownItems);
            expect(response.pageInfo.totalItems).toEqual(numberOfInserts);
        });
        it('should return a number of crowdactions from page 2 based on the limit set', async () => {
            const response = await listCrowdActionsQuery.handle({ page: 2, pageSize: numberOfShownItems });
            expect(response.items.length).toEqual(numberOfShownItems);

            for (const item of response.items) {
                expect(Number(item.title.split('_')[1])).toBeGreaterThanOrEqual(numberOfShownItems);
            }
        });

        it('should filter crowdactions By Status', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: 5,
                filter: { startAt: { gte: new Date('01/01/2029') } },
            });

            expect(response.items.length).toEqual(5);

            for (const item of response.items) {
                const crowdAction = CrowdAction.create(item).withStatuses();
                expect(crowdAction.status).toEqual(CrowdActionStatusEnum.WAITING);
            }

            const response2 = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { startAt: { gte: new Date('01/01/2040') } },
            });

            expect(response2.items.length).toEqual(0);
        });

        it('should filter the crowdactions by subCategory', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { subcategory: 'ELECTIRICITY' },
            });
            expect(response.items.length).toEqual(numberOfInserts / 2);
            for (const item of response.items) {
                expect(item.subcategory).toEqual('ELECTIRICITY');
            }
        });
        it('should filter the crowdactions by Category', async () => {
            const response = await listCrowdActionsQuery.handle({
                page: 1,
                pageSize: numberOfInserts,
                filter: { category: 'FOOD' },
            });
            expect(response.items.length).toEqual(numberOfInserts / 2);
            for (const item of response.items) {
                expect(item.category).toEqual('FOOD');
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
    commitments: [],
    badgeConfig: {
        diamondThreshold: 90,
    },
};

const CrowdActionStub2: CreateCrowdActionDto = {
    title: 'Crowdaction title2',
    description: 'Crowdaction description2',
    category: 'ENERGY',
    subcategory: 'ELECTIRICITY',
    country: 'TG',
    password: 'pa$$w0rd',
    startAt: new Date('01/01/2030'),
    endAt: new Date('08/01/2035'),
    joinEndAt: new Date('07/01/2035'),
    badges: [
        {
            tier: BadgeTierEnum.DIAMOND,
            awardType: AwardTypeEnum.ALL,
            minimumCheckIns: 12,
        },
    ],
    commitments: [],
    badgeConfig: {
        diamondThreshold: 90,
    },
};

const CreateForumStub = (): ICreateForumArgs => {
    return {
        data: {
            type: ForumTypeEnum.FORUM,
            icon: 'accessibility_outline',
            name: 'Default Forum',
            description: 'This is the default forum',
            parentId: undefined,
            visible: true,
        },
        userRole: UserRole.ADMIN,
        isDefault: true,
    };
};

export const CreateProfileStub = (): CreateProfileDto => {
    return {
        userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        country: 'NL',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'I am a cool guy',
    };
};