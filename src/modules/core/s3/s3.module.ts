import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from './s3-client';

@Module({
    providers: [
        {
            provide: S3Client,
            inject: [ConfigService],
            useFactory: (configService: ConfigService): S3Client => new S3Client(configService),
        },
    ],
    exports: [S3Client],
})
export class S3Module {}
