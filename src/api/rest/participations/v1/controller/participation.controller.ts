import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    PaginatedParticipationResponse,
    ParticipationDto,
    ToggleParticipationDto,
    ToggleParticipationResponse,
} from '@infrastructure/participation';
import { IPaginatedList } from '@domain/core';
import { IParticipation } from '@domain/participation';
import { PaginationDto } from '@infrastructure/pagination';
import { ICQRSHandler } from '@common/cqrs';
import {
    GetParticipationForCrowdactionQuery,
    ListParticipationsForCrowdActionQuery,
    ToggleParticipationCommand,
} from '@modules/participation';
import { UserRole } from '@domain/auth/enum';
import { AuthUser } from '@domain/auth/entity';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';

@Controller('v1/participations')
@ApiTags('Participation')
export class ParticipationController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Get(':crowdActionId')
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiOperation({ summary: 'Retrieve participation for a CrowdAction' })
    @ApiResponse({ status: 200, type: ParticipationDto })
    @ApiParam({ name: 'crowdActionId', type: String, required: true })
    async getParticipation(@CurrentUser() user: AuthUser, @Param('crowdActionId') crowdActionId: string): Promise<IParticipation> {
        return this.cqrsHandler.fetch(GetParticipationForCrowdactionQuery, { userId: user.uid, crowdActionId });
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve a paginated list of Participations' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found Participations if any',
        type: PaginatedParticipationResponse,
    })
    async getAllParticipations(
        @Query() pagination: PaginationDto,
        @Query('crowdActionId') crowdActionId: string,
    ): Promise<IPaginatedList<IParticipation>> {
        return this.cqrsHandler.fetch(ListParticipationsForCrowdActionQuery, { ...pagination, filter: { crowdActionId } });
    }

    @Post()
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiOperation({ summary: 'Toggle Participation for a CrowdAction' })
    @ApiResponse({
        status: 200,
        description: 'Returns a response indicating the new Participation status',
        type: ToggleParticipationResponse,
    })
    async toggleParticipation(
        @CurrentUser() user: AuthUser,
        @Body() toggleParticipation: ToggleParticipationDto,
    ): Promise<ToggleParticipationResponse> {
        return this.cqrsHandler.execute(ToggleParticipationCommand, { userId: user.uid, toggleParticipation });
    }
}
