import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from '@api/api.module';
import { ModulesModule } from '@modules/modules.module';
import { AuthModule } from '@modules/auth/auth.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { SchedulerModule } from './modules';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SchedulerModule,
        ApiModule,
        AuthModule,
        InfrastructureModule,
        ModulesModule,
    ],
    exports: [AuthModule],
})
export class AppModule {}
