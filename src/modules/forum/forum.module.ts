import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CQRSModule } from '@common/cqrs';
import {
    CreateForumCommand,
    CreateForumPermissionCommand,
    FetchAllForums,
    FindDefaultForumQuery,
    FindForumByIdQuery,
    FindForumPermissionByIdQuery,
    GetForumHierarchy,
    UpdateForumPermissionsCommand,
} from './cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [
        CreateForumCommand,
        FetchAllForums,
        GetForumHierarchy,
        FindDefaultForumQuery,
        FindForumByIdQuery,
        CreateForumPermissionCommand,
        FindForumPermissionByIdQuery,
        UpdateForumPermissionsCommand,
    ],
    exports: [
        CreateForumCommand,
        FetchAllForums,
        GetForumHierarchy,
        FindDefaultForumQuery,
        FindForumByIdQuery,
        CreateForumPermissionCommand,
        FindForumPermissionByIdQuery,
        UpdateForumPermissionsCommand,
    ],
})
export class ForumModule {}
