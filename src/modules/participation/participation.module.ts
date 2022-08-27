import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import {
    ListParticipationsForCrowdActionQuery,
    ToggleParticipationCommand,
    GetParticipationForCrowdactionQuery,
    GetParticipationsForUserQuery,
} from './cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [
        ListParticipationsForCrowdActionQuery,
        ToggleParticipationCommand,
        GetParticipationForCrowdactionQuery,
        GetParticipationsForUserQuery,
    ],
    exports: [
        ListParticipationsForCrowdActionQuery,
        ToggleParticipationCommand,
        GetParticipationForCrowdactionQuery,
        GetParticipationsForUserQuery,
    ],
})
export class ParticipationModule {}
