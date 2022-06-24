import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import {
    CreateCommitmentOptionCommand,
    DeleteCommitmentOptionCommand,
    GetCommitmentOptionsByType,
    UpdateCommitmentOptionCommand,
} from './cqrs';

@Module({
    imports: [InfrastructureModule],
    providers: [CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand, UpdateCommitmentOptionCommand, GetCommitmentOptionsByType],
    exports: [CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand, UpdateCommitmentOptionCommand, GetCommitmentOptionsByType],
})
export class CommitmentOptionModule {}
