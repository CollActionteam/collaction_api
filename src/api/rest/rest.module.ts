import { Module } from '@nestjs/common';
import { ProfileController } from '@api/rest/profiles';
import { CrowdActionController } from '@api/rest/crowdactions';
import { CQRSModule } from '@common/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ProfileService } from '@modules/profile/service/profile.service';
import { AuthService } from '@modules/auth/service';
import { ParticipationController } from './participations';
import { CommitmentOptionController } from './commitmentoptions';
import { AuthenticationController } from './auth';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    controllers: [AuthenticationController, CrowdActionController, ProfileController, ParticipationController, CommitmentOptionController],
    providers: [CrowdActionService, ProfileService, AuthService],
    exports: [CrowdActionService, ProfileService, AuthService],
})
export class RestModule {}
