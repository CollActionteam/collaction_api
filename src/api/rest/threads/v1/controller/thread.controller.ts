import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';
import { IdentifiableResponse } from '@api/rest/core';
import { CreateThreadDto } from '@infrastructure/thread';
import { AuthUser } from '@domain/auth/entity';
import { ICQRSHandler } from '@common/cqrs';
import { Identifiable } from '@domain/core';
import { CreateThreadCommand } from '@modules/thread/cqrs/command';

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
}
