import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';
import { IdentifiableResponse } from '@api/rest/core';
import { CreateThreadDto, PaginatedThreadResponseDto } from '@infrastructure/thread';
import { PaginationDto } from '@infrastructure/pagination';
import { AuthUser } from '@domain/auth/entity';
import { ICQRSHandler } from '@common/cqrs';
import { Identifiable, IPaginatedList } from '@domain/core';
import { CreateThreadCommand } from '@modules/thread/cqrs/command';
import { ListThreadsByForumQuery } from '@modules/thread';
import { IThread } from '@domain/thread';

@Controller('/v1/threads')
@ApiTags('Threads')
export class ThreadController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Post()
    @FirebaseGuard(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Creates a new Thread' })
    @ApiResponse({
        status: 201,
        description: 'Returns the ID of the new Thread',
        type: IdentifiableResponse,
    })
    @ApiBody({ type: CreateThreadDto, description: 'Creates a new Thread' })
    async createThread(@CurrentUser() authUser: AuthUser, @Body() createThreadBody: CreateThreadDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateThreadCommand, { ...createThreadBody, userId: authUser.uid });
    }

    @Get(':forumId')
    @ApiOperation({ summary: 'Retrieve a paginated list of threads for a specific forum' })
    @ApiParam({ name: 'forumId', required: true, example: 'O9pbPDY7s5e5XwzgwKZtZTDPvLS2' })
    @ApiResponse({
        status: 200,
        description: 'Returns the threads',
        type: PaginatedThreadResponseDto,
    })
    async getThreadsByForum(@Param('forumId') id: string, @Query() { page, pageSize }: PaginationDto): Promise<IPaginatedList<IThread>> {
        return await this.cqrsHandler.fetch(ListThreadsByForumQuery, { forumId: id, filter: { page, pageSize } });
    }
}
