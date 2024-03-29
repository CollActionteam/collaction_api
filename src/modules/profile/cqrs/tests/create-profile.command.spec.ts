import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreateProfileDto } from '@infrastructure/profile';
import { IProfileRepository } from '@domain/profile';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { CreateProfileCommand } from '@modules/profile/cqrs';
import { CountryMustBeValidError } from '@modules/core';

describe('CreateProfileCommand', () => {
    let createProfileCommand: CreateProfileCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let profileModel: Model<ProfilePersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);

        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateProfileCommand,
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
            ],
        }).compile();

        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);
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

    describe('createProfile', () => {
        it('should create a new profile', async () => {
            const profile = await createProfileCommand.execute(CreateProfileStub());
            expect(profile).toBeDefined();
        });
        it('should throw the CountryMustBeValidError', async () => {
            await expect(createProfileCommand.execute(CreateProfileStubWithError())).rejects.toThrow(CountryMustBeValidError);
        });
    });
});

export const CreateProfileStub = (): CreateProfileDto => {
    return {
        userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        country: 'NL',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'I am a cool guy',
    };
};

export const CreateProfileStubWithError = (): CreateProfileDto => {
    return {
        userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        country: 'string',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'I am a cool guy',
    };
};
