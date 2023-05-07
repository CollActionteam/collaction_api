import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import { CreateForumCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery } from './cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [CreateForumCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery],
    exports: [CreateForumCommand, FindDefaultForumQuery, FindForumPermissionByIdQuery],
})
export class ForumModule {}
