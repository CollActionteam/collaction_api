import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateProfileCommand, FindProfileByUserIdQuery, UpdateProfileCommand, UploadProfileImageCommand } from '@modules/profile/cqrs';
import { S3Module } from '@modules/core/s3';
import { ProfileService } from './service';

@Module({
    imports: [InfrastructureModule, S3Module],
    providers: [CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand, FindProfileByUserIdQuery, ProfileService],
    exports: [CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand, FindProfileByUserIdQuery],
})
export class ProfileModule {}
