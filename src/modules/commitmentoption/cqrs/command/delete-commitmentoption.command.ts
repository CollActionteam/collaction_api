import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { CommitmentOption, ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CommitmentOptionDoesNotExistError } from '@modules/commitmentoption/errors';

@Injectable()
export class DeleteCommitmentOptionCommand implements ICommand {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async execute(id: string): Promise<void> {
        const [commitmentOption] = await this.commitmentOptionRepository.findAll({ id });

        if (!commitmentOption) {
            throw new CommitmentOptionDoesNotExistError(id);
        }

        const reliantOptions: CommitmentOption[] = await this.commitmentOptionRepository.findAll({ blocks: { in: [id] } });
        for (const option of reliantOptions) {
            const blocks = option.blocks?.filter((value) => value != id);
            await this.commitmentOptionRepository.patch(option.id, { blocks });
        }

        return await this.commitmentOptionRepository.delete(id);
    }
}
