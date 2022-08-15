import { Test } from '@nestjs/testing';
import { IProfileRepository, Profile } from '@domain/profile';
import { ProfilePersistence, ProfileRepository, ProfileSchema } from '@infrastructure/mongo';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateProfileCommand, UploadProfileImageCommand, UploadProfileImageCommandArgs } from '@modules/profile/cqrs';
import { CreateProfileStub } from './create-profile.command.spec';
import { UploadImageTypeEnum } from '@modules/core/s3/enum';
import { S3ClientService } from '@modules/core/s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IS3ClientRepository } from '@core/s3-client.interface';
import { FileTypeInvalidError } from '@modules/core';

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
                    provide: S3ClientService,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService): S3ClientService => {

                        const mockS3Client = new MockS3ClientRepository();

                        return new S3ClientService(mockS3Client, configService);
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
            const profileId = await createProfileCommand.execute(CreateProfileStub());
            expect(profileId).not.toBeUndefined();

            await uploadProfileImageCommand.execute(UploadProfileImageCommandArgsStub());
            const documents = await profileModel.find({ userId: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2' }, null, { skip: 0, limit: 1 });
            const profile = documents.map((doc) => Profile.create(doc.toObject({ getters: true })))[0];
            expect(profile.avatar).toBe('Upload Successful');
        });
        it('should create a new profile and then fail to upload due to file type', async () => {
            const profileId = await createProfileCommand.execute(CreateProfileStub());
            expect(profileId).not.toBeUndefined();

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
class MockS3ClientRepository implements IS3ClientRepository {
    async upload(params: any): Promise<string> {
        return new Promise<string>(function(resolve) {
            console.log(params);
            setTimeout(function () {
                resolve('Upload Successful');
            }, 1000);
        });
    }
}