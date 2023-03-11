import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICommitmentRepository } from '@domain/commitment';
import { CommitmentPersistence, CommitmentRepository, CommitmentSchema } from '@infrastructure/mongo';
import { CreateCommitmentCommand, IUpdateCommitmentArgs, UpdateCommitmentCommand } from '../command';
import { CreateCommitmentStub } from './create-commitment.command.spec';

describe('CreateCommitmentCommand', () => {
    let updateCommitmentCommand: UpdateCommitmentCommand;
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
                UpdateCommitmentCommand,
                CreateCommitmentCommand,
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
            ],
        }).compile();

        createCommitmentCommand = moduleRef.get<CreateCommitmentCommand>(CreateCommitmentCommand);
        updateCommitmentCommand = moduleRef.get<UpdateCommitmentCommand>(UpdateCommitmentCommand);
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
    describe('updateCommitment', () => {
        it('should create a new commitment and then update it', async () => {
            const commitmentId = await createCommitmentCommand.execute(CreateCommitmentStub());
            expect(commitmentId).not.toBeUndefined();

            const updatedCommitmentId = await updateCommitmentCommand.execute(UpdateCommitmentCommandStub());
            expect(updatedCommitmentId).not.toBeUndefined();
        });
    });
});

export const UpdateCommitmentCommandStub = (): IUpdateCommitmentArgs => {
    return {
        id: '5f9f1b9f9b9b9b9b9b9b9b9b',
        updateDto: {
            tags: ['FOOD'],
            icon: 'accessibility_outline',
        },
    };
};
