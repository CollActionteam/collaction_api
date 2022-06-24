import firebaseAdmin from 'firebase-admin';
import { getAuth } from 'firebase/auth';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from '@infrastructure/mongo';
import { CQRSModule } from '@common/cqrs';
import { FirebaseAuthAdmin, FirebaseAuthClient } from '@infrastructure/auth/providers';

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
            provide: FirebaseAuthClient,
            useFactory: (): FirebaseAuthClient => getAuth() as FirebaseAuthClient,
        },
        {
            provide: FirebaseAuthAdmin,
            useFactory: (): FirebaseAuthAdmin => firebaseAdmin.auth(),
        },
    ],
    exports: [FirebaseAuthAdmin, FirebaseAuthClient, MongoModule],
})
export class InfrastructureModule {}
