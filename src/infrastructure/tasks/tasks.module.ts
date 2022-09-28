import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { SchedulerService } from '@modules/scheduler';

@Module({
    imports: [CQRSModule],
    providers: [SchedulerService],
})
export class TasksModule {}
