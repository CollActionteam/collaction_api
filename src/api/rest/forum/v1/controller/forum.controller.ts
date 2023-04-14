import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { Forum } from '@domain/forum';
import { ForumDto } from '@infrastructure/forum';
import { FetchAllForums, getForumHierachy } from '@modules/forum';

@Controller('v1/forum')
@ApiTags('Forum')
export class ForumController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

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
    async getForumHierachy(@Param('forumId') id: string): Promise<Forum[]> {
        return await this.cqrsHandler.fetch(getForumHierachy, id);
    }
}
