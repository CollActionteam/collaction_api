import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@common/logger';
import { ICQRSHandler } from '@common/cqrs';
import { ListCrowdActionsQuery, UpdateCrowdActionStatusesCommand } from '@modules/crowdaction';
import { CrowdAction, CrowdActionStatusEnum } from '@domain/crowdaction';

const FILTER = { status: { in: [CrowdActionStatusEnum.STARTED, CrowdActionStatusEnum.WAITING] } };
@Injectable()
export class UpdateCrowdactionStatusTask {
    constructor(private readonly CQRSHandler: ICQRSHandler) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        const crowdActionsList = await this.CQRSHandler.fetch(ListCrowdActionsQuery, { filter: FILTER });

        let pageInfo = crowdActionsList.pageInfo;
        let items = crowdActionsList.items;
        let changedCrowdActions = 0;
        for (let page = 1; page <= pageInfo.totalPages; page++) {
            for (const crowdAction of items) {
                const { id, status, joinStatus }: CrowdAction = CrowdAction.create(crowdAction).updateStatuses();
                if (status !== crowdAction.status || joinStatus !== crowdAction.joinStatus) {
                    if (status === CrowdActionStatusEnum.ENDED) {
                        // TODO: Award Badges
                        // this.CQRSHandler.execute(AwardBadgesForCrowdActionCommand, { crowdAction });
                    }

                    changedCrowdActions++;
                    this.CQRSHandler.execute(UpdateCrowdActionStatusesCommand, { id, status, joinStatus });
                }
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
