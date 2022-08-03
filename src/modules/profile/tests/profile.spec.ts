import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from '../service';
import { IProfileRepository, Profile } from '@domain/profile';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { getModelToken } from '@nestjs/mongoose';
import { ProfileDoesNotExistError } from '../errors/profile.error';

describe('ProfileService', () => {
    let profileService: ProfileService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let profileModel: Model<ProfilePersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                { provide: IProfileRepository, useClass: ProfileRepository },
            ],
        }).compile();

        profileService = moduleRef.get<ProfileService>(ProfileService);
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

    // id is changed by mongo so we can't find it with the stub id
    // describe('findByIdOrFail', () => {
    //     it('should find a profile using an id or fail', async () => {
    //         await (new profileModel(ProfileStub()).save());
    //         const profile = await profileService.findByIdOrFail(ProfileStub().id);
    //         expect(profile.userId).toBe(ProfileStub().userId);
    //     });
    // });

    describe('findByUserIdOrFail', () => {
        it('should find a profile using a userId or fail', async () => {
            await new profileModel(ProfileStub()).save();
            const profile: Profile = await profileService.findByUserIdOrFail(ProfileStub().userId);
            expect(profile.userId).toBe(ProfileStub().userId);
        });
        it('should return ProfileDoesNotExistError', async () => {
            await new profileModel(ProfileStub()).save();
            await expect(profileService.findByUserIdOrFail('O9pbPDY3s5e5XwzgwKZtZTDPvLS1')).rejects.toThrow(ProfileDoesNotExistError);
        });
    });

    describe('findByUserIdOrFail', () => {
        it('should find a profile using a userId or fail', async () => {
            await new profileModel(ProfileStub()).save();
            const profile: Profile = await profileService.findByUserIdOrFail(ProfileStub().userId);
            expect(profile.userId).toBe(ProfileStub().userId);
        });
        it('should return ProfileDoesNotExistError', async () => {
            await new profileModel(ProfileStub()).save();
            await expect(profileService.findByUserIdOrFail('O9pbPDY3s5e5XwzgwKZtZTDPvLS1')).rejects.toThrow(ProfileDoesNotExistError);
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
