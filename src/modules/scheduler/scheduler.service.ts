import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { Logger } from '@common/logger';
import { ICQRSHandler } from '@common/cqrs';
import { ListCrowdActionsQuery, UpdateCrowdActionStatusesCommand } from '@modules/crowdaction';
import { CrowdAction, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';
import { DelegateBadgesCommand } from '@modules/crowdaction/cqrs/command/delegate-badges.command';

const FILTER = { status: { in: [CrowdActionStatusEnum.STARTED, CrowdActionStatusEnum.WAITING] } };
@Injectable()
export class SchedulerService {
    constructor(private readonly CQRSHandler: ICQRSHandler, private readonly schedulerRegistry: SchedulerRegistry) {}

    async scheduleTasks() {
        const crowdActionsList = await this.CQRSHandler.fetch(ListCrowdActionsQuery, { filter: FILTER });

        let pageInfo = crowdActionsList.pageInfo;
        let items = crowdActionsList.items;
        let changedCrowdActions = 0;
        for (let page = 1; page <= pageInfo.totalPages; page++) {
            for (const crowdAction of items) {
                const createdCrowdAction: CrowdAction = CrowdAction.create(crowdAction).updateStatuses();
                // Go through the different dates until we find one that is after now.
                this.createCron(createdCrowdAction);
                changedCrowdActions++;
            }

            if (pageInfo.totalPages > pageInfo.page) {
                const result = await this.CQRSHandler.fetch(ListCrowdActionsQuery, {
                    filter: FILTER,
                    page: pageInfo.page + 1,
                });

                pageInfo = result.pageInfo;
                items = result.items;
            } else {
                items = [];
            }
        }

        Logger.log(`[SchedulerService] ScheduleTasks:Successfully - Executed on ${changedCrowdActions} CrowdActions`);
    }

    createCron(crowdAction: CrowdAction) {
        const now = new Date();
        const date =
            crowdAction.startAt > now ? crowdAction.startAt : crowdAction.joinEndAt > now ? crowdAction.joinEndAt : crowdAction.endAt;

        const crowdActionJob = new CronJob(date, () => {
            const { id, status, joinStatus, joinEndAt, endAt }: CrowdAction = crowdAction.updateStatuses();
            if (joinStatus !== crowdAction.joinStatus) {
                if (joinStatus === CrowdActionJoinStatusEnum.CLOSED) {
                    // After joinEndAt restart the same Cron with the endAt date instead
                    crowdActionJob.setTime(new CronTime(endAt));
                }
            } else if (status !== crowdAction.status) {
                if (status === CrowdActionStatusEnum.ENDED) {
                    this.CQRSHandler.execute(DelegateBadgesCommand, crowdAction);
                } else if (status === CrowdActionStatusEnum.STARTED) {
                    crowdActionJob.setTime(new CronTime(joinEndAt));
                }
            }

            this.CQRSHandler.execute(UpdateCrowdActionStatusesCommand, { id, status, joinStatus });
        });

        this.schedulerRegistry.addCronJob(crowdAction.id, crowdActionJob);
        Logger.log(`[SchedulerService] CreateCron:Successfully - Executed on ${crowdAction.id}`);
        crowdActionJob.start();
    }

    stopAllCrons() {
        const cronJobs = this.schedulerRegistry.getCronJobs();

        for (const job of cronJobs.values()) {
            job.stop();
        }
    }
}
