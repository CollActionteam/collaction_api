import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DeleteCommitmentOptionCommand } from '@modules/commitmentoption/cqrs';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema } from '@infrastructure/mongo';

describe('DeleteCommitmentOptionCommand', () => {
    let deleteCommitmentOptionCommand: DeleteCommitmentOptionCommand;

    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            providers: [
                DeleteCommitmentOptionCommand,
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();

        deleteCommitmentOptionCommand = moduleRef.get<DeleteCommitmentOptionCommand>(DeleteCommitmentOptionCommand);
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
    describe('deleteCommitmentOption', () => {
        it('should delete a commitmentoption', async () => {
            const commitmentOptionId = await deleteCommitmentOptionCommand.execute(DeleteCommitmentOptionStub());
            expect(commitmentOptionId).not.toBeUndefined();
        });
        it('should delete a commitmentoption then throw the CommitmentOptionDoesNotExistError', async () => {
            await deleteCommitmentOptionCommand.execute(DeleteCommitmentOptionStub());
            await expect(deleteCommitmentOptionCommand.execute(DeleteCommitmentOptionStub())).rejects.toThrow();
        })
    });
});

export const DeleteCommitmentOptionStub = (): any => {
    return '5f9f1c1b9b9b9b9b9b9b9b9b';
}
