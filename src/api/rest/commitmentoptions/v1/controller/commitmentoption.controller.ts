import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand } from '@modules/commitmentoption';
import { Identifiable } from '@domain/core';
import { CreateCommitmentOptionDto } from '@infrastructure/commitmentoption';

@Controller('v1/commitmentoptions')
@ApiTags('CommitmentOption')
export class CommitmentOptionController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}
    @Post()
    @ApiBody({ type: CreateCommitmentOptionDto, description: 'Creates a new CommitmentOption' })
    async createCommitmentOption(@Body() createDto: CreateCommitmentOptionDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateCommitmentOptionCommand, createDto);
    }

    @Delete(':id')
    async deleteCommitmentOption(@Param('id') id: string): Promise<Identifiable> {
        await this.cqrsHandler.execute(DeleteCommitmentOptionCommand, id);
        return { id };
    }
}
