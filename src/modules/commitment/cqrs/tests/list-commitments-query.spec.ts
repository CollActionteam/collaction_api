import {ListCommitmentsQuery} from "@modules/commitment/cqrs/query/list-commitments.query";
import {Model} from "mongoose";
import {CommitmentPersistence} from "@infrastructure/mongo";

describe('ListCommitmentsQuery', () => {
    const listCommitmentsQuery = ListCommitmentsQuery;
    let CommitmentModel: Model<CommitmentPersistence>;
})