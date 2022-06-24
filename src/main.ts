import fs from 'fs';
import * as firebaseAdmin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, LoggerService } from '@nestjs/common';
import { Logger } from '@common/logger';
import { ApiErrorFilter } from '@common/filter';
import { AppModule } from './app.module';

function initializeFirebase() {
    initializeApp({
        appId: process.env.FIREBASE_APP_ID,
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
    // eslint-disable-next-line import/namespace
    firebaseAdmin.initializeApp();
}

function awesomeStartMessage(logger: LoggerService, port: string, hostUrl: string, restPath: string): void {
    logger.log('=====================================');
    logger.log(`Host:     ${hostUrl}`);
    logger.log(`Port:     ${port}`);
    logger.log(`Rest API: ${hostUrl}${restPath}`);
    logger.log('=====================================');
}

function bootstrapLogger(): LoggerService {
    Logger.bootstrap();
    return Logger.create();
}

function bootstrapSwagger(app: INestApplication, hostUrl: string): void {
    const apiDesc: string = fs.readFileSync('assets/api-desc.html', 'utf8');

    const swaggerConfig = new DocumentBuilder()
        .setTitle('CollAction API')
        .setDescription(apiDesc)
        .setVersion('1.0')
        .addServer(hostUrl)
        .addBearerAuth(
            {
                scheme: 'bearer',
                type: 'http',
            },
            'Authorization',
        )
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument);
}

async function bootstrap() {
    initializeFirebase();

    const logger = bootstrapLogger();

    const app = await NestFactory.create(AppModule, { logger });
    const configService = app.get(ConfigService);

    const port = configService.get('PORT');
    const hostUrl = configService.get('HOST_URL');
    const restPath = configService.get('REST_PATH');

    app.enableShutdownHooks().setGlobalPrefix(restPath).useGlobalFilters(new ApiErrorFilter());

    bootstrapSwagger(app, hostUrl);

    await app.listen(port);

    awesomeStartMessage(logger, port, hostUrl, restPath);
}
bootstrap();
