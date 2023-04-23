import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { Forum } from '@domain/forum';
import { CreateForumDto, ForumDto, ForumPermissionDto, UpdateForumPermissionDto } from '@infrastructure/forum';
import { CreateForumCommand, FetchAllForums, GetForumHierarchy, UpdateForumPermissionsCommand } from '@modules/forum';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { Identifiable } from '@domain/core';
import { AuthUser } from '@domain/auth/entity';
import { IdentifiableResponse } from '@api/rest/core';
import { UserRole } from '@domain/auth/enum';

@Controller('v1/forum')
@ApiTags('Forum')
export class ForumController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Post()
    @FirebaseGuard(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a forum' })
    @ApiResponse({
        status: 201,
        description: '',
        type: IdentifiableResponse,
    })
    @ApiBody({ type: CreateForumDto, description: "Creates a new forum and it's permissions" })
    async createForum(
        @CurrentUser() authUser: AuthUser,
        @Body() forumDto: CreateForumDto,
        @Param('isDefault') isDefault: boolean,
    ): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateForumCommand, {
            data: forumDto,
            userRole: authUser.customClaims.role,
            isDefault: isDefault,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Fetch all forums' })
    @ApiResponse({
        status: 200,
        description: 'Returns all forums',
        type: [ForumDto],
    })
    async getAllForums(): Promise<Forum[]> {
        return await this.cqrsHandler.fetch(FetchAllForums, {});
    }

    @Get(':forumId')
    @ApiOperation({ summary: 'Fetch forum and all its children' })
    @ApiResponse({
        status: 200,
        description: 'Fetch forum and all its children',
        type: [ForumDto],
    })
    async getForumHierarchy(@Param('forumId') id: string): Promise<Forum[]> {
        return await this.cqrsHandler.fetch(GetForumHierarchy, id);
    }

    @Put(':forumId')
    @ApiOperation({ summary: 'Update a forums permissions' })
    @ApiResponse({
        status: 201,
        description: '',
        type: ForumPermissionDto,
    })
    async updateForumPermissions(
        @Param('forumId') id: string,
        @Body() updateForumPermissionBody: UpdateForumPermissionDto,
    ): Promise<Identifiable> {
        return await this.cqrsHandler.execute(UpdateForumPermissionsCommand, { forumId: id, data: updateForumPermissionBody });
    }
}
