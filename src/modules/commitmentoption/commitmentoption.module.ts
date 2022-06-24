import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand } from './cqrs';

@Module({
    imports: [InfrastructureModule],
    providers: [CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand],
    exports: [CreateCommitmentOptionCommand, DeleteCommitmentOptionCommand],
})
export class CommitmentOptionModule {}
