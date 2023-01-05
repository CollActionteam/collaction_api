import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateCommitmentCommand, DeleteCommitmentCommand, GetCommitmentsByType, UpdateCommitmentCommand } from './cqrs';

@Module({
    imports: [InfrastructureModule],
    providers: [CreateCommitmentCommand, DeleteCommitmentCommand, UpdateCommitmentCommand, GetCommitmentsByType],
    exports: [CreateCommitmentCommand, DeleteCommitmentCommand, UpdateCommitmentCommand, GetCommitmentsByType],
})
export class CommitmentModule {}
