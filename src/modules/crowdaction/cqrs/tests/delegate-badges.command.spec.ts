import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { DelegateBadgesCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import {
    CommitmentPersistence,
    CommitmentRepository,
    CommitmentSchema,
    CrowdActionPersistence,
    CrowdActionSchema,
    ParticipationPersistence,
    ParticipationRepository,
    ParticipationSchema,
    ProfilePersistence,
    ProfileRepository,
    ProfileSchema,
} from '@infrastructure/mongo';
import { ListParticipationsForCrowdActionQuery } from '@modules/participation';
import { IProfileRepository, Profile } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { CrowdAction, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { Commitment, ICommitmentRepository } from '@domain/commitment';
import { AwardBadgesCommand } from '@modules/profile/cqrs';

describe('DelegateBadgesCommand', () => {
    let delegateBadgesCommand: DelegateBadgesCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let participationModel: Model<ParticipationPersistence>;
    let commitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                DelegateBadgesCommand,
                AwardBadgesCommand,
                ListParticipationsForCrowdActionQuery,
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
            ],
        }).compile();

        delegateBadgesCommand = moduleRef.get<DelegateBadgesCommand>(DelegateBadgesCommand);
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

    describe('delegateBadgesCommand', () => {
        it('should create a new profile, new commitment, new crowdAction, new participation, and delegate badges', async () => {
            await profileModel.create(CreateProfileStub());
            const commitmentDocument = await commitmentModel.create(CreateCommitmentStub());
            const commitment = Commitment.create(commitmentDocument.toObject({ getters: true }));

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitment]));

            const crowdAction = CrowdAction.create(crowdactionDocument.toObject({ getters: true }));

            await participationModel.create(CreateParticipationStub(crowdAction.id, [commitment.id]));

            await delegateBadgesCommand.execute(crowdAction);

            // Awarding of badges is done asynchronous but isn't awaited
            await new Promise((res) => setTimeout(res, 1000));

            const documents = await profileModel.find({ userId: 'user-id' });
            const profile = documents.map((doc) => Profile.create(doc.toObject({ getters: true })))[0];

            expect(profile.badges?.length).toBe(1);
        });
    });
});

const CreateProfileStub = (): any => {
    return {
        userId: 'user-id',
        location: {
            code: 'NL',
            name: 'Netherlands',
        },
        firstName: 'John',
        lastName: 'Doe',
        badges: [],
    };
};

const CreateCommitmentStub = (): any => {
    return {
        id: '1234-1234-1234-1234',
        label: 'label',
        tags: ['FOOD'],
        points: 10,
        icon: 'accessibility_outline',
    };
};

const CreateCrowdActionStub = (commitments: Commitment[]): any => {
    return {
        title: 'Crowdaction title',
        slug: 'crowdaction-title',
        description: 'Crowdaction description',
        location: {
            code: 'NL',
            name: 'Netherlands',
        },
        category: 'FOOD',
        password: 'pa$$w0rd',
        startAt: new Date('01/01/2025'),
        endAt: new Date('08/01/2025'),
        joinEndAt: new Date('07/07/2025'),
        joinStatus: CrowdActionJoinStatusEnum.OPEN,
        status: CrowdActionStatusEnum.STARTED,
        participantCount: 0,
        commitments: commitments,
        images: {
            card: 'card-image',
            banner: 'banner-image',
        },
        badges: [
            {
                tier: BadgeTierEnum.BRONZE,
                awardType: AwardTypeEnum.ALL,
                minimumCheckIns: 10,
            },
        ],
        badgeConfig: {
            diamondThreshold: 90,
        },
    };
};

const CreateParticipationStub = (id: string, commitments: string[]): any => {
    return {
        crowdActionId: id,
        userId: 'user-id',
        fullName: 'John Doe',
        avatar: 'avatar',
        commitments: commitments,
        joinDate: new Date('06/06/2025'),
        dailyCheckIns: 15,
    };
};
