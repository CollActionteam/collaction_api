import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { UpdateCommitmentOptionDto } from '@infrastructure/commitmentoption';
import { Identifiable } from '@domain/core';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { CommitmentOptionDoesNotExistError } from '@modules/commitmentoption';

export interface IUpdateCommitmentOptionArgs {
    readonly id: string;
    readonly updateDto: UpdateCommitmentOptionDto;
}

@Injectable()
export class UpdateCommitmentOptionCommand implements ICommand {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async execute({ id, updateDto }: IUpdateCommitmentOptionArgs): Promise<Identifiable> {
        if (updateDto.blocks?.length) {
            for (const id of updateDto.blocks) {
                const [commitmentOption] = await this.commitmentOptionRepository.findAll({ id });
                if (!commitmentOption) {
                    throw new CommitmentOptionDoesNotExistError(id);
                }
            }
        }

        await this.commitmentOptionRepository.patch(id, updateDto);
        return { id };
    }
}
