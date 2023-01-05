import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Commitment, ICommitmentRepository } from '@domain/commitment';
import { CrowdActionTypeEnum } from '@domain/crowdaction';

@Injectable()
export class GetCommitmentsByType implements IQuery<CrowdActionTypeEnum> {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async handle(type: CrowdActionTypeEnum): Promise<Commitment[]> {
        const commitments = await this.commitmentRepository.findAll({ type });
        return commitments;
    }
}
