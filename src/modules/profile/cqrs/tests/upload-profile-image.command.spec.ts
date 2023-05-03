import { Test } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { IProfileRepository, Profile } from '@domain/profile';
import { CreateProfileCommand, UploadProfileImageCommand, UploadProfileImageCommandArgs } from '@modules/profile/cqrs';
import { BlobClientService, FileTypeInvalidError, UploadImageTypeEnum } from '@modules/core';
import { CreateProfileStub } from './create-profile.command.spec';
import { IBlobClientRepository } from '@core/blob-client.interface';

describe('CreateProfileCommand', () => {
    let uploadProfileImageCommand: UploadProfileImageCommand;
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
                UploadProfileImageCommand,
                CreateProfileCommand,
                ConfigService,
                { provide: IProfileRepository, useClass: ProfileRepository },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel },
                {
                    provide: BlobClientService,
                    inject: [ConfigService],
                    useFactory: (): BlobClientService => {
                        const mockBlobClient = new MockBlobClientRepository();

                        return new BlobClientService(mockBlobClient);
                    },
                },
            ],
        }).compile();

        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);
        uploadProfileImageCommand = moduleRef.get<UploadProfileImageCommand>(UploadProfileImageCommand);
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

    describe('uploadProfileImage', () => {
        it('should create a new profile and then upload a string to be the new image', async () => {
            const profile = await createProfileCommand.execute(CreateProfileStub());
            expect(profile).toBeDefined();

            await uploadProfileImageCommand.execute(UploadProfileImageCommandArgsStub());
            const documents = await profileModel.find({ userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2' }, null, { skip: 0, limit: 1 });
            const createdProfile = documents.map((doc) => Profile.create(doc.toObject({ getters: true })))[0];
            expect(createdProfile.avatar).toBe('profiles/' + createdProfile.userId + '.jpeg');
        });
        it('should create a new profile and then fail to upload due to file type', async () => {
            const profile = await createProfileCommand.execute(CreateProfileStub());
            expect(profile).toBeDefined();

            await expect(uploadProfileImageCommand.execute(UploadProfileImageCommandArgsStubWithError())).rejects.toThrow(
                FileTypeInvalidError,
            );
        });
    });
});

export const UploadProfileImageCommandArgsStub = (): UploadProfileImageCommandArgs => {
    return {
        file: { mimetype: 'image/jpeg', buffer: '' },
        id: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        type: UploadImageTypeEnum.PROFILE,
    };
};

export const UploadProfileImageCommandArgsStubWithError = (): UploadProfileImageCommandArgs => {
    return {
        file: { mimetype: 'image/error', buffer: '' },
        id: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2',
        type: UploadImageTypeEnum.PROFILE,
    };
};

@Injectable()
class MockBlobClientRepository implements IBlobClientRepository {
    async upload(params: any, imageName: string): Promise<any> {
        return new Promise<any>(function (resolve) {
            setTimeout(function () {
                resolve('Upoload successful' + params + imageName);
            }, 1000);
        });
    }
}
