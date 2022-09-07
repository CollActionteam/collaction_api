import { Test } from '@nestjs/testing';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { CreateCommitmentOptionCommand, UpdateCommitmentOptionCommand } from '../command';
import { CreateCommitmentOptionStub } from './create-commitmentoption.command.spec';
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema } from '@infrastructure/mongo';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { UpdateCommitmentOptionDto } from '@infrastructure/commitmentoption';
import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';

describe('CreateCommitmentOptionCommand', () => {
    let updateCommitmentOptionCommand: UpdateCommitmentOptionCommand;
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
                UpdateCommitmentOptionCommand,
                CreateCommitmentOptionCommand,
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
            ],
        }).compile();

        createCommitmentOptionCommand = moduleRef.get<CreateCommitmentOptionCommand>(CreateCommitmentOptionCommand);
        updateCommitmentOptionCommand = moduleRef.get<UpdateCommitmentOptionCommand>(UpdateCommitmentOptionCommand);
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
    describe('updateCommitmentOption', () => {
        it('should create a new commitmentOption and then update it', async () => {
            const commitmentOptionId = await createCommitmentOptionCommand.execute(CreateCommitmentOptionStub());
            expect(commitmentOptionId).not.toBeUndefined();

            const updatedCommitmentOptionId = await updateCommitmentOptionCommand.execute(UpdateCommitmentOptionCommandStub());
            expect(updatedCommitmentOptionId).not.toBeUndefined();
        });
    });
});

export const UpdateCommitmentOptionCommandStub = (): UpdateCommitmentOptionDto => {
    return {
        type: CrowdActionTypeEnum.WASTE,
        icon: CommitmentOptionIconEnum.no_beef,
        label: 'label',
        description: 'test',
        points: 10,
    };
};
