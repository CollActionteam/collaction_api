import { Module } from '@nestjs/common';
import { RestModule } from '@api/rest';
import { CQRSModule } from '@common/cqrs';

@Module({
    imports: [RestModule, CQRSModule],
})
export class ApiModule {}
