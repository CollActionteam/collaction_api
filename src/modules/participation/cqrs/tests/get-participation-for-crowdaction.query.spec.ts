import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { connect, Connection, Model } from 'mongoose';
import { SchedulerService } from '@modules/scheduler';
import { UserIsNotParticipatingError } from '../../error/participation.error';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { GetParticipationForCrowdactionQuery } from '@modules/participation';
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
import { CrowdActionService } from '@modules/crowdaction';
import {
    CrowdAction,
    ICrowdActionRepository,
    CrowdActionTypeEnum,
    CrowdActionCategoryEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
} from '@domain/crowdaction';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';

import { IParticipationRepository } from '@domain/participation';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';

import { IProfileRepository } from '@domain/profile';

describe('GetParticipationForCrowdactionQuery', () => {
    let getParticipationForCrowdactionQuery: GetParticipationForCrowdactionQuery;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdActionModel: Model<CrowdActionPersistence>;
    let participationModel: Model<ParticipationPersistence>;
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
                GetParticipationForCrowdactionQuery,
                SchedulerService,
                SchedulerRegistry,
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

            const result = await getParticipationForCrowdactionQuery.handle({
                userId: profile.userId,
                crowdActionId: crowdAction.id,
            });

            expect(result).toBeDefined();
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
        location: {
            code: 'NL',
            name: 'Netherlands',
        },
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
