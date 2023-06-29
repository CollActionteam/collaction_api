import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import {
    AwardBadgesCommand,
    CreateProfileCommand,
    FindProfileByUserIdQuery,
    UpdateProfileCommand,
    UploadProfileImageCommand,
} from '@modules/profile/cqrs';
import { BlobModule } from '@modules/core';
import { ProfileService } from './service';

@Module({
    imports: [InfrastructureModule, BlobModule],
    providers: [
        CreateProfileCommand,
        UpdateProfileCommand,
        UploadProfileImageCommand,
        FindProfileByUserIdQuery,
        AwardBadgesCommand,
        ProfileService,
    ],
    exports: [CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand, FindProfileByUserIdQuery, AwardBadgesCommand],
})
export class ProfileModule {}
