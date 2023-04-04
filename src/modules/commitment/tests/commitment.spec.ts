import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, connect, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICommitmentRepository, Commitment } from '@domain/commitment';
import { CommitmentPersistence, CommitmentRepository, CommitmentSchema } from '@infrastructure/mongo';
import { CommitmentDoesNotExistError } from '../errors/commitment.error';
import { CommitmentService } from '../service';
import { CreateCommitmentCommand } from '../cqrs';

describe('CommitmentService', () => {
    let createCommitmentCommand: CreateCommitmentCommand;
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
                CreateCommitmentCommand,
                CommitmentService,
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
            ],
        }).compile();

        commitmentService = moduleRef.get<CommitmentService>(CommitmentService);
        createCommitmentCommand = moduleRef.get<CreateCommitmentCommand>(CreateCommitmentCommand);
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
            const newCommitment = await createCommitmentCommand.execute(CommitmentStub());
            const foundCommitment: Commitment = await commitmentService.findByIdOrFail(newCommitment.id);
            expect(newCommitment.id).toBe(foundCommitment.id);
        });

        it('should return CommitmentDoesNotExistError', async () => {
            await new commitmentModel(CommitmentStub()).save();
            await expect(commitmentService.findByIdOrFail('628cdea92e19fd912f0d520e')).rejects.toThrow(CommitmentDoesNotExistError);
        });
    });
});

export const CommitmentStub = () => {
    return {
        tags: ['FOOD'],
        label: 'Food',
        description: 'I want to help people with food',
        points: 10,
        blocks: [],
        icon: 'accessibility_outline',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
