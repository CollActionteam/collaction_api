import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { connect, Connection, Model } from 'mongoose';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { ToggleParticipationCommand } from '@modules/participation/cqrs/command/toggle-participation.command';
import {
    CommitmentOptionPersistence,
    CommitmentOptionSchema,
    CrowdActionPersistence,
    CrowdActionRepository,
    CrowdActionSchema,
    ParticipationPersistence,
    ParticipationRepository,
    ParticipationSchema,
    ProfileRepository,
    ProfilePersistence,
    ProfileSchema,
    CommitmentOptionRepository,
} from '@infrastructure/mongo';
import {
    ICrowdActionRepository,
    CrowdAction,
    CrowdActionCategoryEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
    CrowdActionTypeEnum,
} from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';
import { IParticipationRepository } from '@domain/participation';
import { CreateCrowdActionCommand, FindCrowdActionByIdQuery, IncrementParticipantCountCommand } from '@modules/crowdaction/cqrs';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { SchedulerService } from '@modules/scheduler';
import { ProfileService } from '@modules/profile';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';

describe('ToggleParticipationCommand', () => {
    let toggleParticipationCommand: ToggleParticipationCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let participationModel: Model<ParticipationPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ToggleParticipationCommand,
                CreateCrowdActionCommand,
                IncrementParticipantCountCommand,
                SchedulerService,
                SchedulerRegistry,
                FindProfileByUserIdQuery,
                ProfileService,
                FindCrowdActionByIdQuery,
                GetCommitmentOptionsByType,
                {
                    provide: 'CrowdActionService',
                    useClass: CrowdActionService,
                },
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();

        toggleParticipationCommand = moduleRef.get<ToggleParticipationCommand>(ToggleParticipationCommand);
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

    describe('toggleParticipationCommand', () => {
        it('should toggle the participation command', async () => {
            // create profile, commitmenoption, crowdaction, and participation
            const profile = await profileModel.create(CreateProfileStub());

            const commitmentOptionDocument = await commitmentOptionModel.create(CreateCommitmentOptionStub());
            const commitmentOption = CommitmentOption.create(commitmentOptionDocument.toObject({ getters: true }));

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitmentOption]));
            const crowdAction = CrowdAction.create(crowdactionDocument.toObject({ getters: true }));

            const participate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitmentOptions: [commitmentOption.id] },
            });

            expect(participate).toBeDefined();
            expect(participate.isParticipating).toEqual(true);

            const unparticipate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitmentOptions: [commitmentOption.id] },
            });

            expect(unparticipate.isParticipating).toEqual(false);
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
        description: 'Crowdaction description',
        category: CrowdActionCategoryEnum.FOOD,
        subcategory: CrowdActionCategoryEnum.SUSTAINABILITY,
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
        commitmentOptions: commitmentOptions,
        images: {
            card: 'card-image',
            banner: 'banner-image',
        },
    };
};
