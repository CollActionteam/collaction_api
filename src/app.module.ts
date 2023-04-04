import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from '@api/api.module';
import { ModulesModule } from '@modules/modules.module';
import { AuthModule } from '@modules/auth/auth.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        ApiModule,
        AuthModule,
        InfrastructureModule,
        ModulesModule,
    ],
    exports: [AuthModule],
})
export class AppModule {}
