import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { Logger } from '@common/logger';
import { ICQRSHandler } from '@common/cqrs';
import { ListCrowdActionsQuery, UpdateCrowdActionStatusesCommand } from '@modules/crowdaction';
import { CrowdAction, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';

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
                const { id, endAt, joinEndAt }: CrowdAction = CrowdAction.create(crowdAction).updateStatuses();
                // Check if we have passed the joinEndAt on server start
                const date = joinEndAt < new Date() ? joinEndAt : endAt;
                const crowdActionJob = new CronJob(date, () => {
                    const { status, joinStatus }: CrowdAction = CrowdAction.create(crowdAction).updateStatuses();

                    if (joinStatus !== crowdAction.joinStatus) {
                        if (joinStatus === CrowdActionJoinStatusEnum.CLOSED) {
                            // After joinEndAt restart the same Cron with the endAt date instead
                            crowdActionJob.setTime(new CronTime(endAt));
                        }
                    } else if (status !== crowdAction.status) {
                        if (status === CrowdActionStatusEnum.ENDED) {
                            // TODO: Award Badges
                            // this.cqrsHandler.execute(AwardBadgesForCrowdActionCommand, { crowdAction });
                        }
                    }

                    changedCrowdActions++;
                    this.CQRSHandler.execute(UpdateCrowdActionStatusesCommand, { id, status, joinStatus });
                });

                this.schedulerRegistry.addCronJob(id, crowdActionJob);
                crowdActionJob.start();
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

        Logger.log(`[TaskScheduler] UpdateCrowdactionStatusTask:Successfully - Executed on ${changedCrowdActions} CrowdActions`);
    }
}
