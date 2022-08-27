import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Identifiable, IPaginatedList } from '@domain/core';
import { CrowdActionStatusEnum, ICrowdAction } from '@domain/crowdaction';
import { ICQRSHandler } from '@common/cqrs';
import { CreateCrowdActionDto, GetCrowdActionDto, PaginatedCrowdActionResponse } from '@infrastructure/crowdaction';
import {
    FindCrowdActionByIdQuery,
    CreateCrowdActionCommand,
    ListCrowdActionsQuery,
    UpdateCrowdActionImagesCommand,
    ListCrowdActionsForUserQuery,
} from '@modules/crowdaction';
import { PaginationDto } from '@infrastructure/pagination';
import { IdentifiableResponse } from '@api/rest/core';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';
import { AuthUser } from '@domain/auth/entity';

@Controller('v1/crowdactions')
@ApiTags('CrowdAction')
export class CrowdActionController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve a paginated list of CrowdActions' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found CrowdActions and Pagination Information',
        type: PaginatedCrowdActionResponse,
    })
    @ApiQuery({ name: 'status', enum: CrowdActionStatusEnum, type: [String], isArray: true, required: false })
    async getAllCrowdActions(
        @Query() { page, pageSize }: PaginationDto,
        @Query('status') status: CrowdActionStatusEnum[],
    ): Promise<IPaginatedList<ICrowdAction>> {
        let filter: any;
        if (status) {
            filter = { status: { in: status } };
        }

        return this.cqrsHandler.fetch(ListCrowdActionsQuery, { page, pageSize, filter });
    }

    @Get('/me')
    @FirebaseGuard(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Retrieve a paginated list of CrowdActions which a user is or has participated in' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found CrowdActions and Pagination Information',
        type: PaginatedCrowdActionResponse,
    })
    @ApiQuery({ name: 'status', enum: CrowdActionStatusEnum, type: [String], isArray: true, required: false })
    async getAllCrowdActionsForUser(
        @CurrentUser() user: AuthUser,
        @Query() { page, pageSize }: PaginationDto,
        @Query('status') status: CrowdActionStatusEnum[],
    ): Promise<IPaginatedList<ICrowdAction>> {
        let filter: any;
        if (status) {
            filter = { status: { in: status } };
        }

        return this.cqrsHandler.fetch(ListCrowdActionsForUserQuery, { userId: user.uid, filter: { page, pageSize, filter } });
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Returns the found CrowdAction if any',
        type: GetCrowdActionDto,
    })
    @ApiOperation({ summary: 'Retrieves a specific CrowdAction by ID' })
    @ApiParam({ name: 'id', required: true })
    async getCrowdAction(@Param('id') id: string): Promise<Omit<ICrowdAction, 'joinEndAt'>> {
        return await this.cqrsHandler.fetch(FindCrowdActionByIdQuery, id);
    }

    @Post()
    @FirebaseGuard(UserRole.ADMIN)
    @ApiOperation({ summary: 'Creates a new CrowdAction' })
    @ApiResponse({
        status: 201,
        description: 'Returns the ID of the new CrowdAction',
        type: IdentifiableResponse,
    })
    @ApiBody({ type: CreateCrowdActionDto, description: 'Creates a new CrowdAction' })
    async createCrowdAction(@Body() createCrowdActionBody: CreateCrowdActionDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateCrowdActionCommand, createCrowdActionBody);
    }

    @Post(':id/images')
    @FirebaseGuard(UserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                card: {
                    type: 'string',
                    format: 'binary',
                },
                banner: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'banner', maxCount: 1 },
            { name: 'card', maxCount: 1 },
        ]),
    )
    async updateImage(@Param('id') id: string, @UploadedFiles() { banner, card }): Promise<Identifiable> {
        await this.cqrsHandler.execute(UpdateCrowdActionImagesCommand, { id, banner, card });
        return { id };
    }
}
