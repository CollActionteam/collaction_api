import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [ScheduleModule.forRoot(), CQRSModule],
    providers: [SchedulerService],
    exports: [SchedulerService],
})
export class SchedulerModule {}
