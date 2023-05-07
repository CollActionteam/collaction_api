import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ICrowdActionRepository } from '@domain/crowdaction';
import { CreateCrowdActionCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    CrowdActionRepository,
    CommitmentRepository,
    CommitmentPersistence,
    CommitmentSchema,
    ForumRepository,
    ForumPermissionRepository,
    ForumPermissionPersistence,
    ForumPermissionSchema,
    ForumPersistence,
    ForumSchema,
    ThreadRepository,
    ThreadPersistence,
    ThreadSchema,
    ProfilePersistence,
    ProfileSchema,
    ProfileRepository,
} from '@infrastructure/mongo';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { ICommitmentRepository } from '@domain/commitment';
import {
    CrowdActionMustBeInTheFutureError,
    MustEndAfterStartError,
    MustJoinBeforeEndError,
    CategoryAndSubcategoryMustBeDisimilarError,
} from '@modules/crowdaction/errors';
import { CountryMustBeValidError } from '@modules/core';
import { UserRole } from '@domain/auth/enum';
import { CreateForumCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery } from '@modules/forum';
import { ForumTypeEnum, IForumPermissionRepository, IForumRepository } from '@domain/forum';
import { CreateThreadCommand } from '@modules/thread';
import { IThreadRepository } from '@domain/thread';
import { CreateProfileCommand, FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { IProfileRepository } from '@domain/profile';
import { CreateProfileDto } from '@infrastructure/profile';
import { ProfileService } from '@modules/profile';

describe('CreateCrowdActionCommand', () => {
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let createForumCommand: CreateForumCommand;
    let createProfileCommand: CreateProfileCommand;
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
        crowdactionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);
        forumPersistenceModel = mongoConnection.model(ForumPersistence.name, ForumSchema);
        forumPermissionPersistenceModel = mongoConnection.model(ForumPermissionPersistence.name, ForumPermissionSchema);
        threadPersistenceModel = mongoConnection.model(ThreadPersistence.name, ThreadSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                CreateCrowdActionCommand,
                CreateForumCommand,
                CreateThreadCommand,
                FindForumPermissionByIdQuery,
                FindDefaultForumQuery,
                FindProfileByUserIdQuery,
                CreateProfileCommand,
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

    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe('createCrowdAction', () => {
        it('should create a new crowdAction', async () => {
            await createProfileCommand.execute(CreateProfileStub());
            const stub = CreateCrowdActionStub(CreateProfileStub().userId);
            const crowdAction = await createCrowdActionCommand.execute(stub);
            expect(crowdAction).toBeDefined();
        });

        it('should throw the CrowdActionMustBeInTheFutureError', async () => {
            const stub = CreateCrowdActionStub('1234');
            stub.crowdActionDto.startAt = new Date('01/01/2022');
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(CrowdActionMustBeInTheFutureError);
        });

        it('should throw the MustEndAfterStartError', async () => {
            const stub = CreateCrowdActionStub('1234');
            stub.crowdActionDto.startAt = new Date('11/01/2025');
            stub.crowdActionDto.endAt = new Date('10/01/2025');
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(MustEndAfterStartError);
        });

        it('should throw the MustJoinBeforeEndError', async () => {
            const stub = CreateCrowdActionStub('1234');
            stub.crowdActionDto.joinEndAt = new Date('09/01/2025');
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(MustJoinBeforeEndError);
        });

        it('should throw the CategoryAndSubcategoryMustBeDisimilarError', async () => {
            const stub = CreateCrowdActionStub('1234');
            stub.crowdActionDto.subcategory = 'FOOD';
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(CategoryAndSubcategoryMustBeDisimilarError);
        });

        it('should throw the CountryMustBeValidError', async () => {
            const stub = CreateCrowdActionStub('1234');
            stub.crowdActionDto.country = 'AZERT';
            await expect(createCrowdActionCommand.execute(stub)).rejects.toThrow(CountryMustBeValidError);
        });
    });
});

const CreateCrowdActionStub = (userId: any): any => {
    return {
        userId: userId,
        userRole: UserRole.ADMIN,
        crowdActionDto: {
            title: 'Crowdaction title',
            description: 'Crowdaction description',
            category: 'FOOD',
            subcategory: 'SUSTAINABILITY',
            country: 'TG',
            password: 'pa$$w0rd',
            startAt: new Date('01/01/2025'),
            endAt: new Date('08/01/2025'),
            joinEndAt: new Date('07/01/2025'),
            commitments: [
                {
                    label: 'Vegan',
                    tags: ['FOOD'],
                    points: 10,
                    icon: 'accessibility_outline',
                },
            ],
            badges: [
                {
                    tier: BadgeTierEnum.BRONZE,
                    awardType: AwardTypeEnum.ALL,
                    minimumCheckIns: 12,
                },
            ],
        },
    };
};

const CreateForumStub = (): any => {
    return {
        id: '',
        type: ForumTypeEnum.FORUM,
        icon: 'accessibility_outline',
        name: 'Default Forum',
        description: 'This is the default forum',
        parentId: undefined,
        parentList: undefined,
        displayOrder: 0,
        threadCount: 0,
        postCount: 0,
        visible: true,
        lastPostInfo: undefined,
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
