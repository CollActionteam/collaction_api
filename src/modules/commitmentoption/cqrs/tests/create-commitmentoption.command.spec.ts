import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateCommitmentOptionDto } from '@infrastructure/commitmentoption';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CreateCommitmentOptionCommand } from '@modules/commitmentoption/cqrs/command/create-commitmentoption.command';
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema } from '@infrastructure/mongo';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';

describe('CreateCommitmentOptionCommand', () => {
    let createCommitmentOptionCommand: CreateCommitmentOptionCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        mongoConnection = (await connect(uri)).connection;
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateCommitmentOptionCommand,
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();

        createCommitmentOptionCommand = moduleRef.get<CreateCommitmentOptionCommand>(CreateCommitmentOptionCommand);
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

    describe('createCommitmentOption', () => {
        it('should create a new commitment option', async () => {
            const commitmentOptionId = await createCommitmentOptionCommand.execute(CreateCommitmentOptionStub());
            expect(commitmentOptionId).not.toBeUndefined();
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
