import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateThreadCommand } from './cqrs/command';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [CreateThreadCommand],
    exports: [CreateThreadCommand],
})
export class ThreadModule {}
