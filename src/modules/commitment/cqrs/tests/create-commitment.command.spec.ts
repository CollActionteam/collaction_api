import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ICommitmentRepository } from '@domain/commitment';
import { CreateCommitmentCommand } from '@modules/commitment/cqrs/command/create-commitment.command';
import { CommitmentPersistence, CommitmentRepository, CommitmentSchema } from '@infrastructure/mongo';
import { CommitmentIconEnum } from '@domain/commitment/enum/commitment.enum';

describe('CreateCommitmentCommand', () => {
    let createCommitmentCommand: CreateCommitmentCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let commitmentModel: Model<CommitmentPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        commitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);

        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateCommitmentCommand,
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
            ],
        }).compile();

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

    describe('createCommitment', () => {
        it('should create a new commitment option', async () => {
            const commitmentId = await createCommitmentCommand.execute(CreateCommitmentStub());
            expect(commitmentId).not.toBeUndefined();
        });
    });
});

export const CreateCommitmentStub = (): any => {
    return {
        _id: 'test',
        tags: ['FOOD'],
        label: 'commitment option label',
        description: 'commitment option description',
        points: 10,
        icon: CommitmentIconEnum.no_beef,
    };
};
