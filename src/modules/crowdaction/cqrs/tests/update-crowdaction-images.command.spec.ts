import * as fs from 'node:fs';
import * as path from 'node:path';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CrowdAction, ICrowdActionRepository, CrowdActionTypeEnum, CrowdActionCategoryEnum } from '@domain/crowdaction';
import { CreateCrowdActionCommand, UpdateCrowdActionImagesCommand } from '@modules/crowdaction/cqrs';
import { CQRSModule } from '@common/cqrs';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    CrowdActionRepository,
    CommitmentOptionRepository,
    CommitmentOptionPersistence,
    CommitmentOptionSchema,
} from '@infrastructure/mongo';
import { BadgeTierEnum, AwardTypeEnum } from '@domain/badge';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';
import { S3ClientService } from '@modules/core/s3';
import { IS3ClientRepository } from '@core/s3-client.interface';

describe('UpdateCrowdActionImagesCommand', () => {
    let updateCrowdActionImagesCommand: UpdateCrowdActionImagesCommand;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        crowdactionModel = mongoConnection.model(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentOptionModel = mongoConnection.model(CommitmentOptionPersistence.name, CommitmentOptionSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                UpdateCrowdActionImagesCommand,
                CreateCrowdActionCommand,
                GetCommitmentOptionsByType,
                ConfigService,
                SchedulerRegistry,
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
                {
                    provide: S3ClientService,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService): S3ClientService => {
                        const mockS3Client = new MockS3ClientRepository();
                        return new S3ClientService(mockS3Client, configService);
                    },
                },
            ],
        }).compile();

        updateCrowdActionImagesCommand = moduleRef.get<UpdateCrowdActionImagesCommand>(UpdateCrowdActionImagesCommand);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe('updateCrowdActionImages', () => {
        it('should create a new crowdAction and update images', async () => {
            const crowdAction = await createCrowdActionCommand.execute(CreateCrowdActionStub());
            expect(crowdAction).toBeDefined();

            await updateCrowdActionImagesCommand.execute({
                id: crowdAction.id,
                card: retrieveImage(),
                banner: retrieveImage(),
            });
            const documents = await crowdactionModel.find({ id: crowdAction.id });
            const createdCrowdAction = documents.map((doc) => CrowdAction.create(doc.toObject({ getters: true })))[0];
            expect(createdCrowdAction.images).toStrictEqual({ banner: 'Upload Successful', card: 'Upload Successful' });
        });
    });
});

const CreateCrowdActionStub = (): any => {
    return {
        type: CrowdActionTypeEnum.FOOD,
        title: 'Crowdaction title',
        description: 'Crowdaction description',
        category: CrowdActionCategoryEnum.FOOD,
        subcategory: CrowdActionCategoryEnum.SUSTAINABILITY,
        country: 'TG',
        password: 'pa$$w0rd',
        images: {
            card: 'https://www.example.com/image.png',
            banner: 'https://www.example.com/image.png',
        },
        startAt: new Date('01/01/2025'),
        endAt: new Date('08/01/2025'),
        joinEndAt: new Date('07/01/2025'),
        badges: [
            {
                tier: BadgeTierEnum.BRONZE,
                awardType: AwardTypeEnum.ALL,
                minimumCheckIns: 12,
            },
        ],
    };
};

@Injectable()
class MockS3ClientRepository implements IS3ClientRepository {
    async upload(): Promise<string> {
        return new Promise<string>(function (resolve) {
            setTimeout(function () {
                resolve('Upload Successful');
            }, 1000);
        });
    }
}

const retrieveImage = () => {
    return [
        {
            fieldname: 'demo_image',
            originalname: 'cal.png',
            mimetype: 'image/png',
            destination: 'uploads',
            filename: 'cal',
            path: path.resolve('./src/modules/crowdaction/cqrs/tests/cal.png'),
            buffer: fs.readFileSync(path.resolve('./src/modules/crowdaction/cqrs/tests/cal.png')),
        },
    ];
};
