import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { Forum } from '@domain/forum';
import { CreateForumDto, ForumDto } from '@infrastructure/forum';
import { CreateForumCommand, FetchAllForums, getForumHierarchy } from '@modules/forum';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';
import { Identifiable } from '@domain/core';
import { AuthUser } from '@domain/auth/entity';

@Controller('v1/forum')
@ApiTags('Forum')
export class ForumController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Post()
    @FirebaseGuard(UserRole.ADMIN)
    @ApiBody({ type: CreateForumDto, description: "Creates a new forum and it's permissions" })
    async createForum(@CurrentUser() authUser: AuthUser, @Body() forumDto: CreateForumDto, @Param('isDefault') isDefault: boolean): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateForumCommand, { data: forumDto, userRole: authUser.customClaims.role, isDefault: isDefault });
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
    async r(@Param('forumId') id: string): Promise<Forum[]> {
        return await this.cqrsHandler.fetch(getForumHierarchy, id);
    }
}
