import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/auth/enum';

export class ForumPermissionDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'forumId', type: String, required: true })
    readonly forumId: string;

    @ApiProperty({ name: 'role', type: UserRole, enum: UserRole, required: true })
    readonly role: UserRole;

    @ApiProperty({ name: 'createThreads', type: Boolean, required: true })
    readonly createThreads: boolean;

    @ApiProperty({ name: 'createPosts', type: Boolean, required: true })
    readonly createPosts: boolean;

    @ApiProperty({ name: 'canLike', type: Boolean, required: true })
    readonly canLike: boolean;

    @ApiProperty({ name: 'canDeleteThreads', type: Boolean, required: true })
    readonly canDeleteThreads: boolean;

    @ApiProperty({ name: 'createThreads', type: Boolean, required: true })
    readonly canDeleteOwnThreads: boolean;

    @ApiProperty({ name: 'canDeletePosts', type: Boolean, required: true })
    readonly canDeletePosts: boolean;

    @ApiProperty({ name: 'canDeleteOwnPosts', type: Boolean, required: true })
    readonly canDeleteOwnPosts: boolean;

    @ApiProperty({ name: 'canEditThreads', type: Boolean, required: true })
    readonly canEditThreads: boolean;

    @ApiProperty({ name: 'canEditPosts', type: Boolean, required: true })
    readonly canEditPosts: boolean;

    @ApiProperty({ name: 'canEditOwnThreads', type: Boolean, required: true })
    readonly canEditOwnThreads: boolean;

    @ApiProperty({ name: 'canEditOwnPosts', type: Boolean, required: true })
    readonly canEditOwnPosts: boolean;

    @ApiProperty({ name: 'canPostPolls', type: Boolean, required: true })
    readonly canPostPolls: boolean;

    @ApiProperty({ name: 'canVotePolls', type: Boolean, required: true })
    readonly canVotePolls: boolean;
}
