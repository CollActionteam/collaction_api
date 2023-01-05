import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { ICommitmentRepository } from '@domain/commitment';
import { Identifiable } from '@domain/core';
import { CreateCommitmentDto } from '@infrastructure/commitment';
import { CommitmentDoesNotExistError } from '@modules/commitment/errors';

@Injectable()
export class CreateCommitmentCommand implements ICommand {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async execute(data: CreateCommitmentDto): Promise<Identifiable> {
        if (data.blocks?.length) {
            for (const id of data.blocks) {
                const [commitment] = await this.commitmentRepository.findAll({ id });
                if (!commitment) {
                    throw new CommitmentDoesNotExistError(id);
                }
            }
        }

        return await this.commitmentRepository.create(data);
    }
}
