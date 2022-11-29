import assert from 'assert';
import { INestApplication, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { createUserWithEmailAndPassword, getAuth, UserCredential } from 'firebase/auth';
import * as firebaseAdmin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { FirebaseAuthAdmin } from '@infrastructure/auth';
import { ProfileDto, ProfileResponseDto, UpdateProfileDto } from '@infrastructure/profile';
import { IS3ClientRepository } from '@core/s3-client.interface';
import { S3ClientService } from '@modules/core/s3';
import { AppModule } from '../../../app.module';

describe('Profile', () => {
    let app: INestApplication;
    let jwtToken: string;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let headersRequest;

    const profileDto: ProfileDto = {
        country: 'NL',
        firstName: 'testFirstName',
    };
    const email = 'testemail@hotmail.com';
    const password = 'testpw';

    async function initTestingModuleWithInMemoryDb(): Promise<TestingModule> {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        return {
                            uri: uri,
                        };
                    },
                }),
                AppModule,
            ],
            providers: [
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

        return moduleRef;
    }

    async function createFireBaseUserAndAddPhoneNumber(): Promise<UserCredential> {
        const auth = getAuth();
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

        const adminAuth: FirebaseAuthAdmin = firebaseAdmin.auth();
        await adminAuth.updateUser(userCredential.user.uid, {
            providerToLink: {
                providerId: 'phone',
                phoneNumber: '+351912823834',
                uid: '+351912823834',
            },
        });

        return userCredential;
    }

    beforeAll(async () => {
        initializeApp({
            appId: process.env.FIREBASE_APP_ID,
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
        firebaseAdmin.initializeApp();

        const moduleRef = await initTestingModuleWithInMemoryDb();
        const userCredential: UserCredential = await createFireBaseUserAndAddPhoneNumber();

        jwtToken = await userCredential.user.getIdToken();
        headersRequest = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
        };

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await mongoConnection.dropDatabase();
    });

    afterAll(async () => {
        await getAuth().currentUser?.delete();
        await app.close();

        await mongoConnection.close();
        await mongod.stop();
    });

    it(`Should create a profile for the current authenticated user `, () => {
        return request(app.getHttpServer()).post('/v1/profiles').set(headersRequest).send(profileDto).expect(201);
    });

    it(`should not retrieve a profile for current user since it was not created yet`, () => {
        return request(app.getHttpServer()).get('/v1/profiles/me').set(headersRequest).expect(404);
    });

    it(`should retrieve the profile for the current authenticated user`, () => {
        return request(app.getHttpServer())
            .post('/v1/profiles')
            .set(headersRequest)
            .send(profileDto)
            .expect(201)
            .then(function () {
                return request(app.getHttpServer()).get('/v1/profiles/me').set(headersRequest).expect(200);
            });
    });

    it(`should retrieve the profile for a user id`, () => {
        return request(app.getHttpServer())
            .post('/v1/profiles')
            .set(headersRequest)
            .send(profileDto)
            .expect(201)
            .then(function () {
                return request(app.getHttpServer())
                    .get('/v1/profiles/me')
                    .set(headersRequest)
                    .then(function (response) {
                        const userId = (response.body as ProfileResponseDto).userId;
                        console.log(`userId = ${userId}`);
                        return request(app.getHttpServer()).get(`/v1/profiles/${userId}`).expect(200);
                    });
            });
    });

    it(`should update a user profile`, () => {
        return request(app.getHttpServer())
            .post('/v1/profiles')
            .set(headersRequest)
            .send(profileDto)
            .expect(201)
            .then(function () {
                const updatedProfileDto: UpdateProfileDto = {
                    userId: 'userIdUpdate',
                };

                return request(app.getHttpServer())
                    .put('/v1/profiles')
                    .set(headersRequest)
                    .send(updatedProfileDto)
                    .expect(200)
                    .expect((res) => {
                        assert.equal(res.body.userId, 'userIdUpdate');
                    });
            });
    });

    @Injectable()
    class MockS3ClientRepository implements IS3ClientRepository {
        async upload(): Promise<string> {
            return new Promise<string>(function (resolve) {
                setTimeout(function () {
                    resolve('Upload Successful');
                }, 1000);
            });
        }
    }

    it(`should upload profile image`, async () => {
        const image = __dirname + '/test-image.jpeg';
        const httpServer = app.getHttpServer();
        request(httpServer).post('/v1/profiles').set(headersRequest).send(profileDto).expect(201);

        headersRequest['Content-Type'] = 'multipart/form-data';
        request(httpServer).post('/v1/profiles/me/image').set(headersRequest).attach('file', image).expect(200);
    });
});
