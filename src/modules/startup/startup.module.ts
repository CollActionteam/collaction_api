import { Global, Module } from '@nestjs/common';
import { SchedulerService } from '@modules/scheduler';
import { CQRSModule } from '@common/cqrs';

@Global()
@Module({
    imports: [CQRSModule],
    providers: [SchedulerService],
})
export class StartupModule {}
