import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { UpdateCrowdactionStatusTask } from './crowdaction';

@Module({
    imports: [CQRSModule],
    providers: [UpdateCrowdactionStatusTask],
})
export class TasksModule {}
