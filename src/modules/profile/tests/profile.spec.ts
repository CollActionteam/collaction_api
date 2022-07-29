import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '@api/rest/profiles';
import { ProfileService } from '../service';
import { IProfileRepository, Profile } from '@domain/profile';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { getModelToken } from '@nestjs/mongoose';

describe('ProfileController', () => {
    let profileController: ProfileController;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let profileModel: Model<ProfilePersistence>;

    beforeEach(async () => {

        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                ProfileService,
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: IProfileRepository, useClass: ProfileRepository },
            ],
        }).compile();

        profileController = moduleRef.get<ProfileController>(ProfileController);
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

    describe('findByIdOrFail', () => {
        it('should find a profile using an id or fail', async () => {
            await new profileModel(ProfileStub()).save();
            const profile = await profileController.getProfile(ProfileStub().id);
            expect(profile.id).toBe(ProfileStub().id);
        });
    });
});

export const ProfileStub = (): Profile => {
    return {
        id: '628cdea92e19fd912f0d520e',
        userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        phone: '+4530249838',
        location: {
            name: 'Netherlands',
            code: 'NL',
        },
        firstName: 'Mathias',
        lastName: undefined,
        bio: undefined,
        avatar: undefined,
    };
};
