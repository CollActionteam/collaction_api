import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { CreateCommitmentCommand, DeleteCommitmentCommand, UpdateCommitmentCommand } from '@modules/commitment';
import { Identifiable } from '@domain/core';
import { CreateCommitmentDto, UpdateCommitmentDto } from '@infrastructure/commitment';
import { FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';

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
}
