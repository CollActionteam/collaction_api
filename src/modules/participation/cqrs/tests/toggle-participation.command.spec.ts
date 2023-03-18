import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { connect, Connection, Model } from 'mongoose';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { ToggleParticipationCommand } from '@modules/participation/cqrs/command/toggle-participation.command';
import {
    CommitmentPersistence,
    CommitmentSchema,
    CrowdActionPersistence,
    CrowdActionRepository,
    CrowdActionSchema,
    ParticipationPersistence,
    ParticipationRepository,
    ParticipationSchema,
    ProfileRepository,
    ProfilePersistence,
    ProfileSchema,
    CommitmentRepository,
} from '@infrastructure/mongo';
import { ICrowdActionRepository, CrowdAction, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { CreateCrowdActionCommand, FindCrowdActionByIdQuery, IncrementParticipantCountCommand } from '@modules/crowdaction/cqrs';
import { SchedulerService } from '@modules/scheduler';
import { ProfileService } from '@modules/profile';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { Commitment, ICommitmentRepository } from '@domain/commitment';

describe('ToggleParticipationCommand', () => {
    let toggleParticipationCommand: ToggleParticipationCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let participationModel: Model<ParticipationPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let commitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);

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
                {
                    provide: 'CrowdActionService',
                    useClass: CrowdActionService,
                },
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
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

            const commitmentDocument = await commitmentModel.create(CreateCommitmentStub());
            const commitment = Commitment.create(commitmentDocument.toObject({ getters: true }));

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitment]));
            const crowdAction = CrowdAction.create(crowdactionDocument.toObject({ getters: true }));

            const participate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitments: [commitment.id] },
            });

            expect(participate).toBeDefined();
            expect(participate.isParticipating).toEqual(true);

            const unparticipate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitments: [commitment.id] },
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

const CreateCommitmentStub = (): any => {
    return {
        id: '1234-1234-1234-1234',
        tags: ['FOOD'],
        label: 'label',
        points: 10,
        icon: 'accessibility_outline',
    };
};

const CreateCrowdActionStub = (commitments: Commitment[]): any => {
    return {
        title: 'Crowdaction title',
        description: 'Crowdaction description',
        category: 'FOOD',
        subcategory: 'SUSTAINABILITY',
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
        commitments: commitments,
        images: {
            card: 'card-image',
            banner: 'banner-image',
        },
    };
};
