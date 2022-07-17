import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdActionRepository } from '@domain/crowdaction';

export interface UpdateStatusesArgs {
    readonly id: string;
    readonly status: CrowdActionStatusEnum;
    readonly joinStatus: CrowdActionJoinStatusEnum;
}

@Injectable()
export class UpdateCrowdActionStatusesCommand implements ICommand {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async execute({ id, status, joinStatus }: UpdateStatusesArgs): Promise<Identifiable> {
        await this.crowdActionRepository.patch(id, { status, joinStatus });
        return { id };
    }
}
