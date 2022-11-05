import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IParticipationRepository, Participation } from '@domain/participation';
import { ParticipationPersistence, ParticipationRepository, ParticipationSchema } from '@infrastructure/mongo';
import { ParticipationService } from '../service';
import { UserHasNoParticipations } from '../error';

describe('ParticipationService', () => {
    let participationService: ParticipationService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let participationModel: Model<ParticipationPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        participationModel = mongoConnection.model(ParticipationPersistence.name, ParticipationSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                ParticipationService,
                { provide: getModelToken(ParticipationPersistence.name), useValue: participationModel },
                { provide: IParticipationRepository, useClass: ParticipationRepository },
            ],
        }).compile();

        participationService = moduleRef.get<ParticipationService>(ParticipationService);
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
        it('should find a participation using an id or fail', async () => {
            const newParticipation = await new participationModel(ParticipationStub()).save();
            const foundParticipation = await participationService.findByIdOrFail(newParticipation.id);
            expect(newParticipation.id).toBe(foundParticipation.id);
        });
        it('should return UserHasNoParticipations', async () => {
            await new participationModel(ParticipationStub()).save();
            await expect(participationService.findByIdOrFail('628cdea92e19fd912f0d520e')).rejects.toThrow(UserHasNoParticipations);
        });
    });
});

export const ParticipationStub = (): Participation => {
    return {
        id: '628cdea92e19fd912f0d520e',
        crowdActionId: '628cdea92e19fd912f0d520e',
        userId: '628cdea92e19fd912f0d520e',
        fullName: 'John Doe',
        avatar: undefined,
        commitmentOptions: ['628cdea92e19fd912f0d520e'],
        joinDate: new Date(),
        dailyCheckIns: 0,
    };
};