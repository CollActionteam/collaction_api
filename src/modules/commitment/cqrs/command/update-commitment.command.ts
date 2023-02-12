import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { UpdateCommitmentDto } from '@infrastructure/commitment';
import { Identifiable } from '@domain/core';
import { ICommitmentRepository } from '@domain/commitment';
import { CommitmentDoesNotExistError } from '@modules/commitment';

export interface IUpdateCommitmentArgs {
    readonly id: string;
    readonly updateDto: UpdateCommitmentDto;
}

@Injectable()
export class UpdateCommitmentCommand implements ICommand {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async execute({ id, updateDto }: IUpdateCommitmentArgs): Promise<Identifiable> {
        if (updateDto.blocks?.length) {
            for (const id of updateDto.blocks) {
                const [commitment] = await this.commitmentRepository.findAll({ _id: id });
                if (!commitment) {
                    throw new CommitmentDoesNotExistError(id);
                }
            }
        }

        await this.commitmentRepository.patch(id, updateDto);
        return { id };
    }
}
