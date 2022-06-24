import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { CreateCrowdActionCommand, FindCrowdActionByIdQuery, ListCrowdActionsQuery } from './cqrs';
import { CrowdActionService } from './service';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        {
            provide: 'PCrowdActionService',
            useClass: CrowdActionService,
        },
    ],
    exports: [CreateCrowdActionCommand, ListCrowdActionsQuery, FindCrowdActionByIdQuery],
})
export class CrowdActionModule {}
