import { Module } from '@nestjs/common';
import { CommitmentOptionModule } from './commitmentoption';
import { ContactModule } from './contact/contact.module';
import { CrowdActionModule } from './crowdaction';
import { ParticipationModule } from './participation';
import { ProfileModule } from './profile';
import { StartupModule } from './startup';

@Module({
    imports: [CrowdActionModule, ProfileModule, ParticipationModule, CommitmentOptionModule, ContactModule, StartupModule],
})
export class ModulesModule {}
