import { Module } from '@nestjs/common';
import { CommitmentModule } from './commitment';
import { ContactModule } from './contact/contact.module';
import { CrowdActionModule } from './crowdaction';
import { ForumModule } from './forum';
import { ParticipationModule } from './participation';
import { ProfileModule } from './profile';
import { StartupModule } from './startup';

@Module({
    imports: [StartupModule, CrowdActionModule, ProfileModule, ParticipationModule, CommitmentModule, ContactModule, ForumModule],
})
export class ModulesModule {}
