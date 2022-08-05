import { Test } from '@nestjs/testing';
import { UpdateProfileDto } from '@infrastructure/profile';
import { IProfileRepository } from '@domain/profile';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateProfileCommand, UpdateProfileCommand } from '@modules/profile/cqrs';
import { CreateProfileStub } from './create-profile.command.spec';
import { CountryMustBeValidError } from '@modules/core';

describe('CreateProfileCommand', () => {
    let updateProfileCommand: UpdateProfileCommand;
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
                UpdateProfileCommand,
                CreateProfileCommand,
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
            ],
        }).compile();

        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);
        updateProfileCommand = moduleRef.get<UpdateProfileCommand>(UpdateProfileCommand);
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

    describe('updateProfile', () => {
        it('should create a new profile and then update it', async () => {
            const profileId = await createProfileCommand.execute(CreateProfileStub());
            expect(profileId).not.toBeUndefined();
            
            const updatedProfileId = await updateProfileCommand.execute(UpdateProfileCommandStub());
            expect(updatedProfileId).not.toBeUndefined();
        });
        it('should create a new profile and then throw the CountryMustBeValidError', async () => {
            const profileId = await createProfileCommand.execute(CreateProfileStub());
            expect(profileId).not.toBeUndefined();

            await expect(updateProfileCommand.execute(UpdateProfileCommandStubWithError())).rejects.toThrow(
                CountryMustBeValidError,
            );
        });
    });
});

export const UpdateProfileCommandStub = (): UpdateProfileDto => {
    return {
        userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        country: 'IE',
        firstName: 'Michael',
        lastName: 'Slattery',
        bio: 'I am a cool guy',
    };
};

export const UpdateProfileCommandStubWithError = (): UpdateProfileDto => {
    return {
        userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        country: 'string',
        firstName: 'Michael',
        lastName: 'Slattery',
        bio: 'I am a cool guy',
    };
};
