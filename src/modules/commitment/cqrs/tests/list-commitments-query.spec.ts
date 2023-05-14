import {ListCommitmentsQuery} from "@modules/commitment/cqrs/query/list-commitments.query";
import {connect, Connection, Model} from "mongoose";
import {CommitmentPersistence} from "@infrastructure/mongo";
import {MongoMemoryServer} from "mongodb-memory-server";

describe('ListCommitmentsQuery', () => {
    const listCommitmentsQuery = ListCommitmentsQuery;
    let CommitmentModel: Model<CommitmentPersistence>;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
    })
})