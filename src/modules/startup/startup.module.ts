import { Global, Module } from '@nestjs/common';
import { SchedulerService } from '@modules/scheduler';
import { StartupService } from './service';
import { CQRSModule } from '@common/cqrs';

@Global()
@Module({
    imports: [CQRSModule],
    providers: [StartupService, SchedulerService],
    exports: [StartupService],
})
export class StartupModule {}
