import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { CreateCommitmentCommand, DeleteCommitmentCommand, UpdateCommitmentCommand } from '@modules/commitment';
import {Identifiable, IPaginatedList} from '@domain/core';
import {CreateCommitmentDto, PaginatedCommitmentResponse, UpdateCommitmentDto} from '@infrastructure/commitment';
import { FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';
import {PaginationDto} from "@infrastructure/pagination";
import {ListCommitmentsQuery} from "@modules/commitment/cqrs/query/list-commitments.query";
import {ICommitment} from "@domain/commitment";

@Controller('v1/commitments')
@ApiTags('Commitment')
export class CommitmentController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Post()
    @FirebaseGuard(UserRole.ADMIN)
    @ApiBody({ type: CreateCommitmentDto, description: 'Creates a new Commitment' })
    async createCommitment(@Body() createDto: CreateCommitmentDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateCommitmentCommand, createDto);
    }

    @Delete(':id')
    @FirebaseGuard(UserRole.ADMIN)
    async deleteCommitment(@Param('id') id: string): Promise<Identifiable> {
        await this.cqrsHandler.execute(DeleteCommitmentCommand, id);
        return { id };
    }

    @Patch(':id')
    @FirebaseGuard(UserRole.ADMIN)
    async updateCommitment(@Param('id') id: string, @Body() updateDto: UpdateCommitmentDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(UpdateCommitmentCommand, { id, updateDto });
    }
    @Get()
    @ApiOperation({ summary: 'Retrieve a paginated list of Commitments' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found Commitments if any',
        type: PaginatedCommitmentResponse,
    })
    @FirebaseGuard(UserRole.ADMIN)
    async getAllCommitments(
        @Query() pagination: PaginationDto,
        @Query('tags') tags: string[],
    ): Promise<IPaginatedList<ICommitment>> {
        return this.cqrsHandler.fetch(ListCommitmentsQuery, { ...pagination, filter: { tags } });
    }
}
