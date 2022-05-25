import { Module } from '@nestjs/common';
import { ProfileController } from '@api/rest/profiles';
import { CrowdActionController } from '@api/rest/crowdactions';
import { CQRSModule } from '@common/cqrs';
import { CrowdActionService } from '@modules/crowdaction';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ProfileService } from '@modules/profile/service/profile.service';
import { ParticipationController } from './participations';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    controllers: [CrowdActionController, ProfileController, ParticipationController],
    providers: [CrowdActionService, ProfileService],
    exports: [CrowdActionService, ProfileService],
})
export class RestModule {}
