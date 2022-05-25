import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand } from '@modules/profile/cqrs';
import { S3Module } from '@modules/core/s3';

@Module({
    imports: [InfrastructureModule, S3Module],
    providers: [CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand],
    exports: [CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand],
})
export class ProfileModule {}
