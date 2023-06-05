import { Module } from '@nestjs/common';
import { ProfileController } from '@api/rest/profiles';
import { CrowdActionController } from '@api/rest/crowdactions';
import { CQRSModule } from '@common/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ProfileService } from '@modules/profile/service/profile.service';
import { AuthService } from '@modules/auth/service';
import { ParticipationController } from './participations';
import { CommitmentController } from './commitments';
import { AuthenticationController } from './auth';
import { ContactController } from './contact';
import { ThreadController } from './threads';
import { ForumController } from './forum/v1/controller';
import { PostController } from './posts/v1/controller';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    controllers: [
        AuthenticationController,
        CrowdActionController,
        ProfileController,
        ParticipationController,
        CommitmentController,
        ThreadController,
        ContactController,
        ForumController,
        PostController
    ],
    providers: [CrowdActionService, ProfileService, AuthService],
    exports: [CrowdActionService, ProfileService, AuthService],
})
export class RestModule {}
