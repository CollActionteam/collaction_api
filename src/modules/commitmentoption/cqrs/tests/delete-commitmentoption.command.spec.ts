import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreateCommitmentOptionDto } from '@infrastructure/commitmentoption';
import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';
import { CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand } from '@modules/commitmentoption/cqrs';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema } from '@infrastructure/mongo';

describe('DeleteCommitmentOptionCommand', () => {
    let deleteCommitmentOptionCommand: DeleteCommitmentOptionCommand;
    let createCommitmentOptionCommand: CreateCommitmentOptionCommand;

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
                CreateCommitmentOptionCommand,
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();
        createCommitmentOptionCommand = moduleRef.get<CreateCommitmentOptionCommand>(CreateCommitmentOptionCommand);
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
            const commitmentOptionId = await createCommitmentOptionCommand.execute(CreateCommitmentOptionStub());
            expect(commitmentOptionId).not.toBeUndefined();

            const createdDocuments = await commitmentOptionModel.find({ commitmentOptionId });
            const commitmentOptions = createdDocuments.map((doc) => CommitmentOption.create(doc.toObject({ getters: true })));
            expect(commitmentOptions.length === 1);

            await deleteCommitmentOptionCommand.execute(commitmentOptionId.id);

            const deletedDocuments = await commitmentOptionModel.find({ commitmentOptionId });
            const noCommitmentOptions = deletedDocuments.map((doc) => CommitmentOption.create(doc.toObject({ getters: true })));
            expect(noCommitmentOptions.length === 0);
        });
    });
});

export const CreateCommitmentOptionStub = (): CreateCommitmentOptionDto => {
    return {
        type: CrowdActionTypeEnum.FOOD,
        label: 'commitment option label',
        description: 'commitment option description',
        points: 10,
        icon: CommitmentOptionIconEnum.no_beef,
    };
};
