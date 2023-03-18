import { Injectable } from '@nestjs/common';
import { Commitment, ICommitmentRepository } from '@domain/commitment';
import { CommitmentDoesNotExistError } from '../errors';

@Injectable()
export class CommitmentService {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async findByIdOrFail(id: string): Promise<Commitment> {
        const commitment = await this.commitmentRepository.findOne({ id });

        if (!commitment) {
            throw new CommitmentDoesNotExistError(id);
        }

        return commitment;
    }
}
