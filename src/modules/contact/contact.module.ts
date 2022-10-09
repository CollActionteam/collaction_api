import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { SendFormCommand } from './cqrs/send-form.command';

@Module({
    imports: [InfrastructureModule],
    providers: [SendFormCommand],
    exports: [SendFormCommand],
})
export class ContactModule {}
