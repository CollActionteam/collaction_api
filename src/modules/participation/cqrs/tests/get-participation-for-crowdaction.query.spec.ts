import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { connect, Connection, Model } from 'mongoose';
import { Commitment, ICommitmentRepository } from '@domain/commitment';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { ToggleParticipationCommand } from '@modules/participation/cqrs/command/toggle-participation.command';
import {
    CommitmentPersistence,
    CommitmentSchema,
    CrowdActionPersistence,
    ParticipationPersistence,
    ProfilePersistence,
    CrowdActionSchema,
    ProfileSchema,
    ParticipationSchema,
    ProfileRepository,
    CrowdActionRepository,
    ParticipationRepository,
    CommitmentRepository,
} from '@infrastructure/mongo';
import { CrowdAction, ICrowdActionRepository, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { FindCrowdActionByIdQuery, IncrementParticipantCountCommand } from '@modules/crowdaction/cqrs';
import { ProfileService } from '@modules/profile';
import { GetParticipationForCrowdactionQuery } from '@modules/participation';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { UserIsNotParticipatingError } from '../../error/participation.error';

describe('GetParticipationForCrowdactionQuery', () => {
    let getParticipationForCrowdactionQuery: GetParticipationForCrowdactionQuery;
    let toggleParticipationCommand: ToggleParticipationCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let participationModel: Model<ParticipationPersistence>;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let CommitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
        CommitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ToggleParticipationCommand,
                IncrementParticipantCountCommand,
                FindProfileByUserIdQuery,
                ProfileService,
                FindCrowdActionByIdQuery,
                GetParticipationForCrowdactionQuery,
                {
                    provide: 'CrowdActionService',
                    useClass: CrowdActionService,
                },
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: getModelToken(CommitmentPersistence.name), useValue: CommitmentModel },
            ],
        }).compile();

        getParticipationForCrowdactionQuery = moduleRef.get<GetParticipationForCrowdactionQuery>(GetParticipationForCrowdactionQuery);
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

    describe('getParticipationForCrowdActionQuery', () => {
        it('should find all participations in a crowdaction', async () => {
            const profile = await profileModel.create(CreateProfileStub());
            const commitment = CreateCommitmentStub();

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitment]));
            const crowdAction = CrowdAction.create(crowdactionDocument.toObject({ getters: true }));

            const participate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitments: [commitment.id] },
            });

            expect(participate).toBeDefined();
            expect(participate.isParticipating).toEqual(true);

            const result = await getParticipationForCrowdactionQuery.handle({
                userId: profile.userId,
                crowdActionId: crowdAction.id,
            });

            expect(result).toBeDefined();

            const unparticipate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitments: [commitment.id] },
            });

            expect(unparticipate).toBeDefined();
            expect(unparticipate.isParticipating).toEqual(false);
        });
        it('should throw UserIsNotParticipatingError', async () => {
            const profile = await profileModel.create(CreateProfileStub());

            const commitmentDocument = await CommitmentModel.create(CreateCommitmentStub());
            const commitment = Commitment.create(commitmentDocument.toObject({ getters: true }));

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitment]));
            const crowdAction = CrowdAction.create(crowdactionDocument.toObject({ getters: true }));

            await expect(
                getParticipationForCrowdactionQuery.handle({
                    userId: profile.userId,
                    crowdActionId: crowdAction.id,
                }),
            ).rejects.toThrow(UserIsNotParticipatingError);
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
        postCount: 0,
        threadCount: 0,
    };
};

const CreateCommitmentStub = (): any => {
    return {
        id: '1234-1234-1234-1234',
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
        badgeConfig: {
            diamondThreshold: 90,
        },
    };
};
