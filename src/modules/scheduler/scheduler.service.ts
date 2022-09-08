import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Logger } from '@common/logger';
import { ICQRSHandler } from '@common/cqrs';
import { ListCrowdActionsQuery, UpdateCrowdActionStatusesCommand } from '@modules/crowdaction';
import { CrowdAction, CrowdActionStatusEnum } from '@domain/crowdaction';

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
            for (const crowdActionInterface of items) {
                const crowdAction: CrowdAction = CrowdAction.create(crowdActionInterface).updateStatuses();
                const job = new CronJob(crowdAction.endAt, () => {
                    if (crowdAction.status !== crowdActionInterface.status || crowdAction.joinStatus !== crowdActionInterface.joinStatus) {
                        if (crowdAction.status === CrowdActionStatusEnum.ENDED) {
                            // TODO: Award Badges
                            // this.cqrsHandler.execute(AwardBadgesForCrowdActionCommand, { crowdAction });
                        }
                    }

                    changedCrowdActions++;
                    this.CQRSHandler.execute(UpdateCrowdActionStatusesCommand, crowdAction);
                });

                this.schedulerRegistry.addCronJob(crowdActionInterface.id, job);
                job.start();
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
