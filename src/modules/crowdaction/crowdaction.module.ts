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
} from './cqrs';
import { CrowdActionService } from './service';
import { ChangeCrowdActionParticipantCountCommand } from './cqrs/command/change-crowdaction-participant-count.command';

@Module({
    imports: [InfrastructureModule, CQRSModule, S3Module],
    providers: [
        ChangeCrowdActionParticipantCountCommand,
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
        ChangeCrowdActionParticipantCountCommand,
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        UpdateCrowdActionImagesCommand,
        UpdateCrowdActionStatusesCommand,
    ],
})
export class CrowdActionModule {}
