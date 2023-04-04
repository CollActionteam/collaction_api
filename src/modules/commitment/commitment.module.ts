import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateCommitmentCommand, DeleteCommitmentCommand, GetCommitmentsByTag, UpdateCommitmentCommand } from './cqrs';

@Module({
    imports: [InfrastructureModule],
    providers: [CreateCommitmentCommand, DeleteCommitmentCommand, UpdateCommitmentCommand, GetCommitmentsByTag],
    exports: [CreateCommitmentCommand, DeleteCommitmentCommand, UpdateCommitmentCommand, GetCommitmentsByTag],
})
export class CommitmentModule {}
