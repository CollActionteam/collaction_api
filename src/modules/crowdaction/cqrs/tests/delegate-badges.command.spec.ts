import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { DelegateBadgesCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import {
    CommitmentOptionPersistence,
    CommitmentOptionRepository,
    CommitmentOptionSchema,
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
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';
import {
    CrowdAction,
    CrowdActionCategoryEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
    CrowdActionTypeEnum,
} from '@domain/crowdaction';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { AwardBadgesCommand } from '@modules/profile/cqrs';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';

describe('DelegateBadgesCommand', () => {
    let delegateBadgesCommand: DelegateBadgesCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let participationModel: Model<ParticipationPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                DelegateBadgesCommand,
                AwardBadgesCommand,
                ListParticipationsForCrowdActionQuery,
                GetCommitmentOptionsByType,
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
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
        it('should create a new profile, new commitmentOption, new crowdAction, new participation, and delegate badges', async () => {
            await profileModel.create(CreateProfileStub());
            const commitmentOptionDocument = await commitmentOptionModel.create(CreateCommitmentOptionStub());
            const commitmentOption = CommitmentOption.create(commitmentOptionDocument.toObject({ getters: true }));

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitmentOption]));

            const crowdAction = CrowdAction.create(crowdactionDocument.toObject({ getters: true }));

            await participationModel.create(CreateParticipationStub(crowdAction.id, [commitmentOption.id]));

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

const CreateCommitmentOptionStub = (): any => {
    return {
        type: CrowdActionTypeEnum.FOOD,
        label: 'label',
        points: 10,
        icon: CommitmentOptionIconEnum.no_beef,
    };
};

const CreateCrowdActionStub = (commitmentOptions: CommitmentOption[]): any => {
    return {
        type: CrowdActionTypeEnum.FOOD,
        title: 'Crowdaction title',
        slug: 'crowdaction-title',
        description: 'Crowdaction description',
        category: CrowdActionCategoryEnum.FOOD,
        subcategory: CrowdActionCategoryEnum.SUSTAINABILITY,
        location: {
            code: 'NL',
            name: 'Netherlands',
        },
        password: 'pa$$w0rd',
        startAt: new Date('01/01/2025'),
        endAt: new Date('08/01/2025'),
        joinEndAt: new Date('07/07/2025'),
        joinStatus: CrowdActionJoinStatusEnum.OPEN,
        status: CrowdActionStatusEnum.STARTED,
        participantCount: 0,
        commitmentOptions: commitmentOptions,
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
    };
};

const CreateParticipationStub = (id: string, commitmentOptions: string[]): any => {
    return {
        crowdActionId: id,
        userId: 'user-id',
        fullName: 'John Doe',
        avatar: 'avatar',
        commitmentOptions: commitmentOptions,
        joinDate: new Date('06/06/2025'),
        dailyCheckIns: 15,
    };
};
