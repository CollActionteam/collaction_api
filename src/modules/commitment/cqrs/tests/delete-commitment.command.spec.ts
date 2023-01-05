import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreateCommitmentDto } from '@infrastructure/commitment';
import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentIconEnum } from '@domain/commitment/enum/commitment.enum';
import { CreateCommitmentCommand, DeleteCommitmentCommand } from '@modules/commitment/cqrs';
import { Commitment, ICommitmentRepository } from '@domain/commitment';
import { CommitmentPersistence, CommitmentRepository, CommitmentSchema } from '@infrastructure/mongo';

describe('DeleteCommitmentCommand', () => {
    let deleteCommitmentCommand: DeleteCommitmentCommand;
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
                DeleteCommitmentCommand,
                CreateCommitmentCommand,
                { provide: ICommitmentRepository, useClass: CommitmentRepository },
                { provide: getModelToken(CommitmentPersistence.name), useValue: commitmentModel },
            ],
        }).compile();
        createCommitmentCommand = moduleRef.get<CreateCommitmentCommand>(CreateCommitmentCommand);
        deleteCommitmentCommand = moduleRef.get<DeleteCommitmentCommand>(DeleteCommitmentCommand);
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
    describe('deleteCommitment', () => {
        it('should delete a commitment', async () => {
            const commitmentId = await createCommitmentCommand.execute(CreateCommitmentStub());
            expect(commitmentId).not.toBeUndefined();

            const createdDocuments = await commitmentModel.find({ commitmentId });
            const commitments = createdDocuments.map((doc) => Commitment.create(doc.toObject({ getters: true })));
            expect(commitments.length === 1);

            await deleteCommitmentCommand.execute(commitmentId.id);

            const deletedDocuments = await commitmentModel.find({ commitmentId });
            const noCommitments = deletedDocuments.map((doc) => Commitment.create(doc.toObject({ getters: true })));
            expect(noCommitments.length === 0);
        });
    });
});

export const CreateCommitmentStub = (): CreateCommitmentDto => {
    return {
        type: CrowdActionTypeEnum.FOOD,
        label: 'commitment option label',
        description: 'commitment option description',
        points: 10,
        icon: CommitmentIconEnum.no_beef,
    };
};
