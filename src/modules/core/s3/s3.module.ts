import { Module } from '@nestjs/common';
import { IS3ClientRepository } from '@core/s3-client.interface';
import { S3ClientRepository } from './s3-client.repository';
import { S3ClientService } from './s3-client.service';

@Module({
    providers: [
        {
            provide: IS3ClientRepository,
            useClass: S3ClientRepository,
        },
        S3ClientService,
    ],
    exports: [S3ClientService],
})
export class S3Module {}
