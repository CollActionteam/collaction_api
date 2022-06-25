import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { ListParticipationsForCrowdActionQuery, ToggleParticipationCommand, GetParticipationForCrowdactionQuery } from './cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [ListParticipationsForCrowdActionQuery, ToggleParticipationCommand, GetParticipationForCrowdactionQuery],
    exports: [ListParticipationsForCrowdActionQuery, ToggleParticipationCommand, GetParticipationForCrowdactionQuery],
})
export class ParticipationModule {}
