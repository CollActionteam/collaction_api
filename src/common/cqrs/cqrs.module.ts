import { Module } from '@nestjs/common';
import { ICQRSHandler, CQRSHandler } from '@common/cqrs';

@Module({
    providers: [{ provide: ICQRSHandler, useClass: CQRSHandler }],
    exports: [ICQRSHandler],
})
export class CQRSModule {}
