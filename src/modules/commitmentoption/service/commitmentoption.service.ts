import { Injectable } from '@nestjs/common';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CommitmentOptionDoesNotExistError } from '../errors';

@Injectable()
export class CommitmentOptionService {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async findByIdOrFail(id: string): Promise<CommitmentOption> {
        const commitmentOption = await this.commitmentOptionRepository.findOne({ id });

        if (!commitmentOption) {
            throw new CommitmentOptionDoesNotExistError(id);
        }

        return commitmentOption;
    }
}
