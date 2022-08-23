import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { S3Module } from '@modules/core/s3';
import {
    CreateCrowdActionCommand,
    FindCrowdActionByIdQuery,
    ListCrowdActionsQuery,
    UpdateCrowdActionImagesCommand,
    UpdateCrowdActionStatusesCommand,
    IncrementParticipantCountCommand,
} from './cqrs';
import { CrowdActionService } from './service';

@Module({
    imports: [InfrastructureModule, CQRSModule, S3Module],
    providers: [
        IncrementParticipantCountCommand,
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        UpdateCrowdActionImagesCommand,
        UpdateCrowdActionStatusesCommand,
        {
            provide: 'PCrowdActionService',
            useClass: CrowdActionService,
        },
    ],
    exports: [
        IncrementParticipantCountCommand,
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        UpdateCrowdActionImagesCommand,
        UpdateCrowdActionStatusesCommand,
    ],
})
export class CrowdActionModule {}
