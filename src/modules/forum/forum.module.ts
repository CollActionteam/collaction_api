import { CQRSModule } from "@common/cqrs";
import { InfrastructureModule } from "@infrastructure/infrastructure.module";
import { Module } from "@nestjs/common";
import {
    FindDefaultForumQuery, FindForumPermissionByIdQuery,
} from './cqrs';

@Module({
    imports: [InfrastructureModule, CQRSModule],
    providers: [
        FindDefaultForumQuery,
        FindForumPermissionByIdQuery,
    ],
    exports: [
        FindDefaultForumQuery,
        FindForumPermissionByIdQuery,
    ]
})
export class ForumModule {}