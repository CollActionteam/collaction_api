import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICommitmentRepository, Commitment } from '@domain/commitment';
import { CommitmentPersistence, CommitmentRepository, CommitmentSchema } from '@infrastructure/mongo';
import { CommitmentDoesNotExistError } from '../errors/commitment.error';
import { CommitmentService } from '../service';

describe('CommitmentService', () => {
    let commitmentService: CommitmentService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let commitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CommitmentService,
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
            ],
        }).compile();

        commitmentService = moduleRef.get<CommitmentService>(CommitmentService);
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
        it('should find a commitment using an id or fail', async () => {
            const newCommitment = await new commitmentModel(CommitmentStub()).save();
            const foundCommitment: Commitment = await commitmentService.findByIdOrFail(newCommitment.id);
            expect(newCommitment._id).toBe(foundCommitment._id);
        });
        it('should return CommitmentDoesNotExistError', async () => {
            await new commitmentModel(CommitmentStub()).save();
            await expect(commitmentService.findByIdOrFail('628cdea92e19fd912f0d520e')).rejects.toThrow(CommitmentDoesNotExistError);
        });
    });
});

export const CommitmentStub = (): Commitment => {
    return {
        _id: '2a04ded6-7109-4e23-83b0-38b16a33db41',
        tags: ['FOOD'],
        label: 'Food',
        description: 'I want to help people with food',
        points: 10,
        blocks: [],
        icon: 'https://www.example.com/image.png',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
