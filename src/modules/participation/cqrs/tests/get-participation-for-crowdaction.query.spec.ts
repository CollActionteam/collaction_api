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
    ParticipationPersistence,
    ProfilePersistence,
    CrowdActionSchema,
    ProfileSchema,
    ParticipationSchema,
    ProfileRepository,
    CrowdActionRepository,
    ParticipationRepository,
    CommitmentOptionRepository,
} from '@infrastructure/mongo';
import { CrowdAction, ICrowdActionRepository, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { CreateCrowdActionCommand, FindCrowdActionByIdQuery, IncrementParticipantCountCommand } from '@modules/crowdaction/cqrs';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { SchedulerService } from '@modules/scheduler';
import { ProfileService } from '@modules/profile';
import { GetParticipationForCrowdactionQuery } from '@modules/participation';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';
import { UserIsNotParticipatingError } from '../../error/participation.error';

describe('GetParticipationForCrowdactionQuery', () => {
    let getParticipationForCrowdactionQuery: GetParticipationForCrowdactionQuery;
    let toggleParticipationCommand: ToggleParticipationCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let participationModel: Model<ParticipationPersistence>;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        crowdActionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
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
                GetParticipationForCrowdactionQuery,
                {
                    provide: 'CrowdActionService',
                    useClass: CrowdActionService,
                },
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdActionModel },
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
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

            const result = await getParticipationForCrowdactionQuery.handle({
                userId: profile.userId,
                crowdActionId: crowdAction.id,
            });

            expect(result).toBeDefined();

            const unparticipate = await toggleParticipationCommand.execute({
                userId: profile.userId,
                toggleParticipation: { crowdActionId: crowdAction.id, commitmentOptions: [commitmentOption.id] },
            });

            expect(unparticipate).toBeDefined();
            expect(unparticipate.isParticipating).toEqual(false);
        });
        it('should throw UserIsNotParticipatingError', async () => {
            const profile = await profileModel.create(CreateProfileStub());

            const commitmentOptionDocument = await commitmentOptionModel.create(CreateCommitmentOptionStub());
            const commitmentOption = CommitmentOption.create(commitmentOptionDocument.toObject({ getters: true }));

            const crowdactionDocument = await crowdActionModel.create(CreateCrowdActionStub([commitmentOption]));
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
    };
};

const CreateCommitmentOptionStub = (): any => {
    return {
        type: 'FOOD',
        label: 'label',
        points: 10,
        icon: 'add',
    };
};

const CreateCrowdActionStub = (commitmentOptions: CommitmentOption[]): any => {
    return {
        type: 'FOOD',
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
        commitmentOptions: commitmentOptions,
        images: {
            card: 'card-image',
            banner: 'banner-image',
        },
    };
};
