import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { S3Module } from '@modules/core/s3';
import { SchedulerModule } from '@modules/scheduler';
import {
    CreateCrowdActionCommand,
    FindCrowdActionByIdQuery,
    ListCrowdActionsQuery,
    UpdateCrowdActionImagesCommand,
    UpdateCrowdActionStatusesCommand,
    IncrementParticipantCountCommand,
    ListCrowdActionsForUserQuery,
    FindCrowdActionBySlugQuery
} from './cqrs';
import { CrowdActionService } from './service';

@Module({
    imports: [InfrastructureModule, CQRSModule, S3Module, SchedulerModule],
    providers: [
        IncrementParticipantCountCommand,
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        FindCrowdActionBySlugQuery,
        UpdateCrowdActionImagesCommand,
        UpdateCrowdActionStatusesCommand,
        {
            provide: 'CrowdActionService',
            useClass: CrowdActionService,
        },
        ListCrowdActionsForUserQuery,
    ],
    exports: [
        IncrementParticipantCountCommand,
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        FindCrowdActionBySlugQuery,
        UpdateCrowdActionImagesCommand,
        UpdateCrowdActionStatusesCommand,
        ListCrowdActionsForUserQuery
    ],
})
export class CrowdActionModule {}
