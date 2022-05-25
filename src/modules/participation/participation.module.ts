import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ListParticipationsForCrowdActionQuery, ToggleParticipationCommand } from './cqrs';

@Module({
    imports: [InfrastructureModule],
    providers: [ListParticipationsForCrowdActionQuery, ToggleParticipationCommand],
    exports: [ListParticipationsForCrowdActionQuery, ToggleParticipationCommand],
})
export class ParticipationModule {}
