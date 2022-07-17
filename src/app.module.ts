import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from '@api/api.module';
import { ModulesModule } from '@modules/modules.module';
import { AuthModule } from '@modules/auth/auth.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { TasksModule } from '@infrastructure/tasks';

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
        TasksModule,
    ],
    exports: [AuthModule],
})
export class AppModule {}
