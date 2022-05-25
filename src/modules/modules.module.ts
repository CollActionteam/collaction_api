import { Module } from '@nestjs/common';
import { CrowdActionModule } from './crowdaction';
import { ParticipationModule } from './participation';
import { ProfileModule } from './profile';

@Module({
    imports: [CrowdActionModule, ProfileModule, ParticipationModule],
})
export class ModulesModule {}
