import { IPaginationQueryArgs, IQuery, paginate } from "@common/cqrs";
import { FindCriteria } from "@core/repository.interface";
import { IPaginatedList } from "@domain/core";
import { IPost } from "@domain/post";
import { IPostRepository, QueryPost } from "@domain/post/interface/post-repository.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ListPostsByThreadQuery implements IQuery<IPaginationQueryArgs<FindCriteria<QueryPost>>, IPaginatedList<IPost>> {

    constructor(private readonly postRepository: IPostRepository) {}

    async handle(filter: IPaginationQueryArgs<FindCriteria<QueryPost>>): Promise<IPaginatedList<IPost>> {
        const filters = { ...filter};
        return paginate(filters, this.postRepository);
    }

}