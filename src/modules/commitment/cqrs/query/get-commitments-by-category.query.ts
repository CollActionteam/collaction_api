import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Commitment, ICommitmentRepository } from '@domain/commitment';

@Injectable()
export class GetCommitmentsByTag implements IQuery<string> {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async handle(tag: string): Promise<Commitment[]> {
        const commitments = await this.commitmentRepository.findAll({ tag });
        return commitments;
    }
}
