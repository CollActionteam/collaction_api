import * as fs from 'node:fs';
import * as path from 'node:path';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CrowdAction, ICrowdActionRepository } from '@domain/crowdaction';
import { CreateCrowdActionCommand, UpdateCrowdActionImagesCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    CrowdActionRepository,
    CommitmentRepository,
    CommitmentPersistence,
    CommitmentSchema,
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
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { ICommitmentRepository } from '@domain/commitment';
import { CreateForumCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery } from '@modules/forum';
import { CreateProfileCommand, FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { CreateThreadCommand } from '@modules/thread';
import { ProfileService } from '@modules/profile';
import { ForumTypeEnum, IForumPermissionRepository, IForumRepository } from '@domain/forum';
import { IThreadRepository } from '@domain/thread';
import { IProfileRepository } from '@domain/profile';
import { CreateProfileDto } from '@infrastructure/profile';
import { UserRole } from '@domain/auth/enum';
import { BlobClientService } from '@modules/core';
import { IBlobClientRepository } from '@core/blob-client.interface';

describe('UpdateCrowdActionImagesCommand', () => {
    let updateCrowdActionImagesCommand: UpdateCrowdActionImagesCommand;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let createForumCommand: CreateForumCommand;
    let createProfileCommand: CreateProfileCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let commitmentModel: Model<CommitmentPersistence>;
    let forumPersistenceModel: Model<ForumPersistence>;
    let forumPermissionPersistenceModel: Model<ForumPermissionPersistence>;
    let threadPersistenceModel: Model<ThreadPersistence>;
    let profileModel: Model<ProfilePersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);
        forumPersistenceModel = mongoConnection.model(ForumPersistence.name, ForumSchema);
        forumPermissionPersistenceModel = mongoConnection.model(ForumPermissionPersistence.name, ForumPermissionSchema);
        threadPersistenceModel = mongoConnection.model(ThreadPersistence.name, ThreadSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                UpdateCrowdActionImagesCommand,
                CreateCrowdActionCommand,
                CreateForumCommand,
                CreateThreadCommand,
                FindForumPermissionByIdQuery,
                FindDefaultForumQuery,
                FindProfileByUserIdQuery,
                CreateProfileCommand,
                ConfigService,
                ProfileService,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: IForumRepository, useClass: ForumRepository },
                { provide: IForumPermissionRepository, useClass: ForumPermissionRepository },
                { provide: IThreadRepository, useClass: ThreadRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
                { provide: getModelToken(ForumPersistence.name), useValue: forumPersistenceModel },
                { provide: getModelToken(ForumPermissionPersistence.name), useValue: forumPermissionPersistenceModel },
                { provide: getModelToken(ThreadPersistence.name), useValue: threadPersistenceModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                {
                    provide: BlobClientService,
                    inject: [ConfigService],
                    useFactory: (): BlobClientService => {
                        const mockBlobClient = new MockBlobClientRepository();
                        return new BlobClientService(mockBlobClient);
                    },
                },
            ],
        }).compile();

        updateCrowdActionImagesCommand = moduleRef.get<UpdateCrowdActionImagesCommand>(UpdateCrowdActionImagesCommand);
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

    describe('updateCrowdActionImages', () => {
        it('should create a new crowdAction and update images', async () => {
            await createProfileCommand.execute(CreateProfileStub());
            const stub = CreateCrowdActionStub(CreateProfileStub().userId);
            const crowdAction = await createCrowdActionCommand.execute(stub);
            expect(crowdAction).toBeDefined();

            await updateCrowdActionImagesCommand.execute({
                id: crowdAction.id,
                card: retrieveImage(),
                banner: retrieveImage(),
            });
            const documents = await crowdActionModel.find({ id: crowdAction.id });
            const createdCrowdAction = documents.map((doc) => CrowdAction.create(doc.toObject({ getters: true })))[0];
            expect(createdCrowdAction.images).toStrictEqual({
                banner: 'crowdaction-banners/' + crowdAction.id + '.png',
                card: 'crowdaction-cards/' + crowdAction.id + '.png',
            });
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

@Injectable()
class MockBlobClientRepository implements IBlobClientRepository {
    async upload(params: any, imageName: string): Promise<any> {
        return new Promise<any>(function (resolve) {
            setTimeout(function () {
                resolve('Upoload successful' + params + imageName);
            }, 1000);
        });
    }
}

const retrieveImage = () => {
    return [
        {
            fieldname: 'demo_image',
            originalname: 'cal.png',
            mimetype: 'image/png',
            destination: 'uploads',
            filename: 'cal',
            path: path.resolve('./src/modules/crowdaction/cqrs/tests/cal.png'),
            buffer: fs.readFileSync(path.resolve('./src/modules/crowdaction/cqrs/tests/cal.png')),
        },
    ];
};
