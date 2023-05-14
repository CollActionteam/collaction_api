import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { ListCommitmentsQuery } from '@modules/commitment/cqrs/query/list-commitments.query';
import { CommitmentPersistence, CommitmentSchema } from '@infrastructure/mongo';
import { CQRSHandler, CQRSModule, ICQRSHandler } from '@common/cqrs';
import { CreateCommitmentStub } from '@modules/commitment/cqrs/tests/create-commitment.command.spec';
import { CreateCommitmentCommand } from '@modules/commitment';

describe('ListCommitmentsQuery', () => {
    let listCommitmentsQuery: ListCommitmentsQuery;
    let commitmentCommand: CreateCommitmentCommand;
    let CommitmentModel: Model<CommitmentPersistence>;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        CommitmentModel = mongoConnection.model(CommitmentPersistence.name, CommitmentSchema);
        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ListCommitmentsQuery,
                CreateCommitmentCommand,
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: getModelToken(CommitmentPersistence.name), useValue: CommitmentModel },
            ],
        }).compile();
        listCommitmentsQuery = moduleRef.get<ListCommitmentsQuery>(ListCommitmentsQuery);
        commitmentCommand = moduleRef.get<CreateCommitmentCommand>(CreateCommitmentCommand);
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
    describe('getAllCommitmentsQuery', () => {
        it('should find all  commitments', async () => {
            const commitment = CreateCommitmentStub();
            await commitmentCommand.execute(commitment);
            const result = await listCommitmentsQuery.handle({
                filter: { tags: ['FOOD'] },
                page: 1,
                pageSize: 1,
            });
            expect(result).toBeDefined();
            expect(result?.items?.length).toEqual(1);
            expect(result?.pageInfo?.pageSize).toEqual(1);
            expect(result?.pageInfo?.totalPages).toEqual(1);
            expect(result?.pageInfo?.totalItems).toEqual(1);
        });
    });
});
