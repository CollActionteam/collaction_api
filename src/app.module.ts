import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from '@api/api.module';
import { ModulesModule } from '@modules/modules.module';
import { AuthModule } from '@modules/auth/auth.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
    imports: [
        ApiModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        InfrastructureModule,
        ModulesModule,
        ScheduleModule.forRoot(),
    ],
    exports: [AuthModule],
})
export class AppModule {}
