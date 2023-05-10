import {Injectable} from "@nestjs/common";
import {IPaginationQueryArgs, IQuery, paginate} from "@common/cqrs";
import {FindCriteria} from "@core/repository.interface";
import {ICommitment, ICommitmentRepository, QueryCommitment} from "@domain/commitment";
import {IPaginatedList} from "@domain/core";

@Injectable()
export class ListCommitmentsQuery implements IQuery<IPaginationQueryArgs<FindCriteria<QueryCommitment>>> {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async handle(filter: IPaginationQueryArgs<FindCriteria<QueryCommitment>>): Promise<IPaginatedList<ICommitment>> {
        return paginate(filter, this.commitmentRepository);
    }
}