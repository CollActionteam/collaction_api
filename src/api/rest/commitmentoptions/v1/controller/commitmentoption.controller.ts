import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand } from '@modules/commitmentoption';
import { Identifiable } from '@domain/core';
import { CreateCommitmentOptionDto } from '@infrastructure/commitmentoption';
import { FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';

@Controller('v1/commitmentoptions')
@ApiTags('CommitmentOption')
export class CommitmentOptionController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}
    @Post()
    @FirebaseGuard(UserRole.ADMIN)
    @ApiBody({ type: CreateCommitmentOptionDto, description: 'Creates a new CommitmentOption' })
    async createCommitmentOption(@Body() createDto: CreateCommitmentOptionDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(CreateCommitmentOptionCommand, createDto);
    }

    @Delete(':id')
    @FirebaseGuard(UserRole.ADMIN)
    async deleteCommitmentOption(@Param('id') id: string): Promise<Identifiable> {
        await this.cqrsHandler.execute(DeleteCommitmentOptionCommand, id);
        return { id };
    }
}
