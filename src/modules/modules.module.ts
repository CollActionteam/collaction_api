import { Module } from '@nestjs/common';
import { CommitmentOptionModule } from './commitmentoption';
import { ContactModule } from './contact/contact.module';
import { CrowdActionModule } from './crowdaction';
import { ParticipationModule } from './participation';
import { ProfileModule } from './profile';
import { StartupModule } from './startup';
import { ThreadModule } from './thread';

@Module({
    imports: [StartupModule, CrowdActionModule, ProfileModule, ParticipationModule, CommitmentOptionModule, ContactModule, ThreadModule],
})
export class ModulesModule {}
