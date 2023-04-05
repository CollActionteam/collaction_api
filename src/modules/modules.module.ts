import { Module } from '@nestjs/common';
import { CommitmentModule } from './commitment';
import { ContactModule } from './contact/contact.module';
import { CrowdActionModule } from './crowdaction';
import { ForumModule } from './forum';
import { ParticipationModule } from './participation';
import { ProfileModule } from './profile';
import { StartupModule } from './startup';
import { ThreadModule } from './thread';

@Module({
    imports: [
        StartupModule,
        CrowdActionModule,
        ProfileModule,
        ParticipationModule,
        CommitmentModule,
        ContactModule,
        ForumModule,
        ThreadModule,
    ],
})
export class ModulesModule {}
