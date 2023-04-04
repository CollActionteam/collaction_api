import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { SchedulerService } from './scheduler.service';

@Module({
    imports: [CQRSModule],
    providers: [SchedulerService],
    exports: [SchedulerService],
})
export class SchedulerModule {}
