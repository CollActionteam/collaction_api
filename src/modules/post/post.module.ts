import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ListPostsByThreadQuery } from './cqrs/query/list-posts-by-thread.query';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [ListPostsByThreadQuery],
    exports: [ListPostsByThreadQuery],
})
export class PostModule {}
