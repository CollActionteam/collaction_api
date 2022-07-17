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

@Module({
    imports: [InfrastructureModule, CQRSModule, S3Module],
    providers: [
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
        CreateCrowdActionCommand,
        ListCrowdActionsQuery,
        FindCrowdActionByIdQuery,
        UpdateCrowdActionImagesCommand,
        UpdateCrowdActionStatusesCommand,
    ],
})
export class CrowdActionModule {}
