import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identifiable, IPaginatedList } from '@domain/core';
import { CrowdActionStatusEnum, ICrowdAction } from '@domain/crowdaction';
import { ICQRSHandler } from '@common/cqrs';
import { CreateCrowdActionCommand, ListCrowdActionsQuery } from '@modules/crowdaction/cqrs';
import { CrowdActionDto, PaginatedCrowdActionResponse } from '@infrastructure/crowdaction';
import { CrowdActionService } from '@modules/crowdaction';
import { PaginationDto } from '@infrastructure/pagination';
import { IdentifiableResponse } from '@api/rest/core';
import { FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';

@Controller('v1/crowdactions')
@ApiTags('CrowdAction')
export class CrowdActionController {
    constructor(private readonly crowdActionService: CrowdActionService, private readonly cqrsHandler: ICQRSHandler) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve a paginated list of CrowdActions' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found CrowdActions and Pagination Information',
        type: PaginatedCrowdActionResponse,
    })
    @ApiQuery({ name: 'status', enum: CrowdActionStatusEnum, type: String, required: false })
    async getAllCrowdActions(
        @Query() { page, pageSize }: PaginationDto,
        @Query('status') status: CrowdActionStatusEnum,
    ): Promise<IPaginatedList<ICrowdAction>> {
        let filter: any;
        if (status) {
            filter = { status };
        }

        return this.cqrsHandler.fetch(ListCrowdActionsQuery, { page, pageSize, filter });
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Returns the found CrowdAction if any',
        type: CrowdActionDto,
    })
    @ApiOperation({ summary: 'Retrieves a specific CrowdAction by ID' })
    @ApiParam({ name: 'id', required: true })
    async getCrowdAction(@Param('id') id: string): Promise<Omit<ICrowdAction, 'joinEndAt'>> {
        return await this.crowdActionService.findByIdOrFail(id);
    }

    @Post()
    @FirebaseGuard(UserRole.ADMIN)
    @ApiOperation({ summary: 'Creates a new CrowdAction' })
    @ApiResponse({
        status: 201,
        description: 'Returns the ID of the new CrowdAction',
        type: IdentifiableResponse,
    })
    @ApiBody({ type: CrowdActionDto, description: 'Creates a new CrowdAction' })
    async createCrowdAction(@Body() createCrowdActionBody: CrowdActionDto): Promise<Identifiable> {
        const id = await this.cqrsHandler.execute(CreateCrowdActionCommand, createCrowdActionBody);
        return { id };
    }
}
