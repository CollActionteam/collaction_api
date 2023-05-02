import { Module } from '@nestjs/common';
import { IBlobClientRepository } from '@core/blob-client.interface';
import { BlobClientRepository } from './blob-client.repository';
import { BlobClientService } from './blob-client.service';

@Module({
    providers: [
        {
            provide: IBlobClientRepository,
            useClass: BlobClientRepository,
        },
        BlobClientService,
    ],
    exports: [BlobClientService],
})
export class BlobModule {}
