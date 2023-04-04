import { Injectable } from '@nestjs/common';
import { IPaginationQueryArgs, IQuery, paginate } from '@common/cqrs';
import { FindCriteria } from '@core/repository.interface';
import { IContact, IContactRepository, QueryContact } from '@domain/contact';
import { IPaginatedList } from '@domain/core';

@Injectable()
export class ListContactsQuery implements IQuery<IPaginationQueryArgs<FindCriteria<QueryContact>>, IPaginatedList<IContact>> {
    constructor(private readonly contactRepository: IContactRepository) {}

    async handle(filter: IPaginationQueryArgs<FindCriteria<QueryContact>>): Promise<IPaginatedList<IContact>> {
        return paginate(filter, this.contactRepository);
    }
}
