import { Test, TestingModule } from '@nestjs/testing';
import { CommitmentOptionService } from '../service';
import { ICommitmentOptionRepository, CommitmentOption } from '@domain/commitmentoption';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema } from '@infrastructure/mongo';
import { getModelToken } from '@nestjs/mongoose';
import { CommitmentOptionDoesNotExistError } from '../errors/commitmentoption.error';
import { CrowdActionTypeEnum } from '@domain/crowdaction';

describe('CommitmentOptionService', () => {
    let commitmentOptionService: CommitmentOptionService;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                CommitmentOptionService,
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
            ],
        }).compile();

        commitmentOptionService = moduleRef.get<CommitmentOptionService>(CommitmentOptionService);
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
        it('should find a commitmentoption using an id or fail', async () => {
            await new commitmentOptionModel(CommitmentOptionStub()).save();
            const commitmentOption: CommitmentOption = await commitmentOptionService.findByIdOrFail(CommitmentOptionStub().id);
            expect(commitmentOption?.id).toBe(CommitmentOptionStub().id);
        });
        it('should return CommitmentOptionDoesNotExistError', async () => {
            await new commitmentOptionModel(CommitmentOptionStub()).save();
            await expect(commitmentOptionService.findByIdOrFail('O9pbPDY3s5e5XwzgwKZtZTDPvLS1')).rejects.toThrow(
                CommitmentOptionDoesNotExistError,
            );
        });
    });
});

export const CommitmentOptionStub = (): CommitmentOption => {
    return {
        id: '628cdea92e19fd912f0d520e',
        type: CrowdActionTypeEnum.FOOD,
        label: 'Food',
        description: 'I want to help people with food',
        points: 10,
        blocks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
