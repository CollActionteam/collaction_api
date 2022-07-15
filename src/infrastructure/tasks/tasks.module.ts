import { Module } from '@nestjs/common';
import { UpdateCrowdactionStatusTask } from './crowdaction';

@Module({
    providers: [UpdateCrowdactionStatusTask],
})
export class TasksModule {}
