import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { ICommitmentRepository } from '@domain/commitment';
import { Identifiable } from '@domain/core';
import { CreateCommitmentDto } from '@infrastructure/commitment';

@Injectable()
export class CreateCommitmentCommand implements ICommand {
    constructor(private readonly commitmentRepository: ICommitmentRepository) {}

    async execute(data: CreateCommitmentDto): Promise<Identifiable> {
        return await this.commitmentRepository.create(data);
    }
}
