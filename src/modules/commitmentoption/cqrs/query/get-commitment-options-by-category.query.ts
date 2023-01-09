import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';

@Injectable()
export class GetCommitmentOptionsByType implements IQuery<string> {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async handle(type: string): Promise<CommitmentOption[]> {
        const commitmentOptions = await this.commitmentOptionRepository.findAll({ type });
        return commitmentOptions;
    }
}
