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
    ForumPersistence,
    ForumPermissionPersistence,
    ThreadPersistence,
    ProfilePersistence,
    ForumSchema,
    ForumPermissionSchema,
    ThreadSchema,
    ProfileSchema,
    ForumRepository,
    ForumPermissionRepository,
    ThreadRepository,
    ProfileRepository,
} from '@infrastructure/mongo';
import { ICrowdActionRepository, CrowdActionStatusEnum, CrowdActionJoinStatusEnum } from '@domain/crowdaction';
import { ICommitmentRepository } from '@domain/commitment';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { UpdateCrowdActionStatusesCommand, CreateCrowdActionCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import { SchedulerService } from '@modules/scheduler';
import { UserRole } from '@domain/auth/enum';
import { CreateForumCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery } from '@modules/forum';
import { CreateProfileCommand, FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { CreateThreadCommand } from '@modules/thread';
import { ForumTypeEnum, IForumPermissionRepository, IForumRepository } from '@domain/forum';
import { IThreadRepository } from '@domain/thread';
import { IProfileRepository } from '@domain/profile';
import { CreateProfileDto } from '@infrastructure/profile';
import { ProfileService } from '@modules/profile';

describe('UpdateCrowdActionStatusesCommand', () => {
    let updateCrowdActionStatusesCommand: UpdateCrowdActionStatusesCommand;
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
                UpdateCrowdActionStatusesCommand,
                CreateCrowdActionCommand,
                CreateForumCommand,
                CreateThreadCommand,
                FindForumPermissionByIdQuery,
                FindDefaultForumQuery,
                FindProfileByUserIdQuery,
                CreateProfileCommand,
                SchedulerService,
                SchedulerRegistry,
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

        updateCrowdActionStatusesCommand = moduleRef.get<UpdateCrowdActionStatusesCommand>(UpdateCrowdActionStatusesCommand);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
        createForumCommand = moduleRef.get<CreateForumCommand>(CreateForumCommand);
        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);

        // Create a default forum so create crowdaction works.
        await createForumCommand.execute(CreateForumStub());
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
            await createProfileCommand.execute(CreateProfileStub());
            const stub = CreateCrowdActionStub(CreateProfileStub().userId);
            const createdCrowdAction = await createCrowdActionCommand.execute(stub);
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
