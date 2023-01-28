import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Commitment, ICommitmentRepository } from '@domain/commitment';

@Injectable()
export class GetCommitmentsByTag implements IQuery<string[]> {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async handle(tags: string[]): Promise<Commitment[]> {
        const commitments = await this.commitmentRepository.findAll({ tags });
        return commitments;
    }
}
