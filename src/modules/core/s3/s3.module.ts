import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3ClientRepository } from './s3-client.repository';
import { S3ClientService } from './s3-client.service';

@Module({
    providers: [
        {
            provide: S3ClientService,
            inject: [ConfigService],
            useFactory: (s3ClientRepository: S3ClientRepository, configService: ConfigService): S3ClientService =>
                new S3ClientService(s3ClientRepository, configService),
        },
    ],
    exports: [S3ClientService],
})
export class S3Module {}
