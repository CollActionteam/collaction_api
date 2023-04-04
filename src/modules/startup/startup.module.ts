import { Global, Module } from '@nestjs/common';
import { SchedulerModule } from '@modules/scheduler';

@Global()
@Module({
    imports: [SchedulerModule],
})
export class StartupModule {}
