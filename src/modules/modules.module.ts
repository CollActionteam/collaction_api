import { Module } from '@nestjs/common';
import { CommitmentModule } from './commitment';
import { ContactModule } from './contact/contact.module';
import { CrowdActionModule } from './crowdaction';
import { ForumModule } from './forum';
import { ParticipationModule } from './participation';
import { ProfileModule } from './profile';
import { ThreadModule } from './thread';
import { PostModule } from './post/post.module';

@Module({
    imports: [
        CrowdActionModule,
        ProfileModule,
        ParticipationModule,
        CommitmentModule,
        ContactModule,
        ForumModule,
        ThreadModule,
        PostModule,
    ],
})
export class ModulesModule {}
