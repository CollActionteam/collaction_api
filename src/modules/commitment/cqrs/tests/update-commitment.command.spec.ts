import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ICommitmentRepository } from '@domain/commitment';
import { CommitmentPersistence, CommitmentRepository, CommitmentSchema } from '@infrastructure/mongo';
import { CreateCommitmentCommand, UpdateCommitmentCommand } from '../command';

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
            const newCommitment = await createCommitmentCommand.execute(CreateCommitmentStub());
            expect(newCommitment).toBeDefined();

            const updatedCommitmentId = await updateCommitmentCommand.execute(UpdateCommitmentCommandStub(newCommitment.id));
            expect(updatedCommitmentId).toBeDefined();
        });
    });
});

export const UpdateCommitmentCommandStub = (id: string) => {
    return {
        id,
        updateDto: {
            tags: ['ENERGY'],
            icon: 'clock_outline',
        },
    };
};

export const CreateCommitmentStub = (): any => {
    return {
        label: 'commitment option label',
        description: 'commitment option description',
        tags: ['FOOD'],
        points: 10,
        icon: 'accessibility_outline',
    };
};
