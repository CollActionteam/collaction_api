import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Commitment, ICommitmentRepository } from '@domain/commitment';

@Injectable()
export class GetCommitmentsByTag implements IQuery<string[]> {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async handle(tags: string[]): Promise<Commitment[]> {
        return await this.commitmentRepository.findAll({ tags });
    }
}
