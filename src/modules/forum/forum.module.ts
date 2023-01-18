import { Module } from '@nestjs/common';
import { CQRSModule } from '@common/cqrs';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { FindForumByIdQuery, FindForumPermissionByIdQuery } from './cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [FindForumByIdQuery, FindForumPermissionByIdQuery],
    exports: [FindForumByIdQuery, FindForumPermissionByIdQuery],
})
export class ForumModule {}
