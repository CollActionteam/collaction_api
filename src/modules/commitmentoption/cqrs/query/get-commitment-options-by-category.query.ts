import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CrowdActionTypeEnum } from '@domain/crowdaction';

@Injectable()
export class GetCommitmentOptionsByType implements IQuery<CrowdActionTypeEnum> {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async handle(type: CrowdActionTypeEnum): Promise<CommitmentOption[]> {
        const commitmentOptions = await this.commitmentOptionRepository.findAll({ type });
        return commitmentOptions;
    }
}
