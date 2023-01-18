import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { CreateThreadCommand } from '@modules/thread/cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [CreateThreadCommand],
    exports: [CreateThreadCommand],
})
export class ThreadModule {}
