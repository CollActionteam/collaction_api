import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@common/logger';

@Injectable()
export class UpdateCrowdactionStatusTask {
    @Cron(CronExpression.EVERY_HOUR)
    handleCron() {
        Logger.log('[TaskScheduler] Task Scheduler is running - UpdateCrowdactionStatusTask');

        // TODO: Implement
    }
}
