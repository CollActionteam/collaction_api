import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { Identifiable } from '@domain/core';
import { CreateCommitmentOptionDto } from '@infrastructure/commitmentoption';
import { CommitmentOptionDoesNotExistError } from '@modules/commitmentoption/errors';

@Injectable()
export class CreateCommitmentOptionCommand implements ICommand {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async execute(data: CreateCommitmentOptionDto): Promise<Identifiable> {
        if (data.blocks?.length) {
            console.dir(data.blocks);
            for (const id of data.blocks) {
                const [commitmentOption] = await this.commitmentOptionRepository.findAll({ id });
                if (!commitmentOption) {
                    throw new CommitmentOptionDoesNotExistError(id);
                }
            }
        }

        return await this.commitmentOptionRepository.create(data);
    }
}
