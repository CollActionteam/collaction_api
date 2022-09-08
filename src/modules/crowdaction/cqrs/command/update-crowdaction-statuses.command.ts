import { SchedulerRegistry } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { CronTime } from 'cron';
import { ICommand } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { CrowdAction, CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdActionRepository } from '@domain/crowdaction';

export interface UpdateStatusesArgs {
    readonly id: string;
    readonly status: CrowdActionStatusEnum;
    readonly joinStatus: CrowdActionJoinStatusEnum;
}

@Injectable()
export class UpdateCrowdActionStatusesCommand implements ICommand {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository, private readonly schedulerRegistry: SchedulerRegistry) {}

    async execute(crowdAction: CrowdAction): Promise<Identifiable> {
        const id = crowdAction.id;
        const status = crowdAction.status;
        const joinStatus = crowdAction.joinStatus;

        await this.crowdActionRepository.patch(crowdAction.id, { status, joinStatus });

        const job = this.schedulerRegistry.getCronJob(crowdAction.id);
        job.setTime(new CronTime(crowdAction.endAt));

        return { id };
    }
}
