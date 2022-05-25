import firebaseAdmin from 'firebase-admin';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '@infrastructure/mongo';
import { CQRSModule } from '@common/cqrs';
import { FirebaseAuthAdmin } from './auth/providers/firebase-auth-admin.provider';

@Global()
@Module({
    imports: [
        CQRSModule,
        MongoModule,
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGO_URL'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: FirebaseAuthAdmin,
            useFactory: (): FirebaseAuthAdmin => firebaseAdmin.auth(),
        },
    ],
    exports: [FirebaseAuthAdmin, MongoModule],
})
export class InfrastructureModule {}
