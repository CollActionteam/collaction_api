import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateCrowdActionCommand, ListCrowdActionsQuery } from './cqrs';

@Module({
    imports: [InfrastructureModule],
    providers: [CreateCrowdActionCommand, ListCrowdActionsQuery],
    exports: [CreateCrowdActionCommand, ListCrowdActionsQuery],
})
export class CrowdActionModule {}
