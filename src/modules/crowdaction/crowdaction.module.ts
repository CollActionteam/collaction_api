import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { BlobModule } from '@modules/core';
import {
    CreateCrowdActionCommand,
    FindCrowdActionByIdQuery,
    ListCrowdActionsQuery,
    UpdateCrowdActionImagesCommand,
    IncrementParticipantCountCommand,
    ListCrowdActionsForUserQuery,
    FindCrowdActionBySlugQuery,
} from './cqrs';
import { CrowdActionService } from './service';

@Module({
    imports: [InfrastructureModule, CQRSModule, BlobModule],
    providers: [
        IncrementParticipantCountCommand,
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        FindCrowdActionBySlugQuery,
        UpdateCrowdActionImagesCommand,
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
        ListCrowdActionsForUserQuery,
    ],
})
export class CrowdActionModule {}
