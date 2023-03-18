import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { CommitmentDoesNotExistError } from '@modules/commitment/errors';
import { Commitment, ICommitmentRepository } from '@domain/commitment';

@Injectable()
export class DeleteCommitmentCommand implements ICommand {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async execute(id: string): Promise<void> {
        const [commitment] = await this.commitmentRepository.findAll({ id });

        if (!commitment) {
            throw new CommitmentDoesNotExistError(id);
        }

        const reliantOptions: Commitment[] = await this.commitmentRepository.findAll({ blocks: { in: [id] } });
        for (const option of reliantOptions) {
            const blocks = option.blocks?.filter((value) => value != id);
            await this.commitmentRepository.patch(option.id, { blocks });
        }

        return await this.commitmentRepository.delete(id);
    }
}
