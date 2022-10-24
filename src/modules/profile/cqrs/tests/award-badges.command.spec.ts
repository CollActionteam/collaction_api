import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CQRSModule } from '@common/cqrs';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { IProfileRepository, Profile } from '@domain/profile';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { AwardBadgesCommand } from '@modules/profile/cqrs';

describe('AwardBadgesCommand', () => {
    let awardBadgesCommand: AwardBadgesCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;

    let profileModel: Model<ProfilePersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                AwardBadgesCommand,
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
            ],
        }).compile();

        awardBadgesCommand = moduleRef.get<AwardBadgesCommand>(AwardBadgesCommand);
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

    describe('awardBadgesCommand', () => {
        it('award a badge to a users profile', async () => {
            await profileModel.create(CreateProfileStub());
            const badge = {
                tier: BadgeTierEnum.BRONZE,
                awardType: AwardTypeEnum.ALL,
                minimumCheckIns: 10,
            };

            const { id } = await awardBadgesCommand.execute({ userId: 'user-id', badges: [badge] });

            const profileDocuments = await profileModel.find({ id });
            const profile = profileDocuments.map((doc) => Profile.create(doc.toObject({ getters: true })))[0];

            expect(profile.badges).toBeDefined();
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
