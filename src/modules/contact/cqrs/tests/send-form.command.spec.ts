import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SchedulerRegistry } from '@nestjs/schedule';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { SchedulerService } from '@modules/scheduler';
import { ContactDto } from '@infrastructure/contact/dto/contact.dto';
import { IContactRepository } from '@domain/contact';
import { ContactPersistence, ContactRepository, ContactSchema } from '@infrastructure/mongo';
import { SendFormCommand } from '../send-form.command';

describe('SendFormCommand', () => {
    let sendFormCommand: SendFormCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let contactModel: Model<ContactPersistence>;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;

        contactModel = mongoConnection.model(ContactPersistence.name, ContactSchema);

        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ContactDto,
                SendFormCommand,
                SchedulerService,
                SchedulerRegistry,
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: IContactRepository, useClass: ContactRepository },
                { provide: getModelToken(ContactPersistence.name), useValue: contactModel },
            ],
        }).compile();

        sendFormCommand = moduleRef.get<SendFormCommand>(SendFormCommand);
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

    describe('sendFormCommand', () => {
        it('should create a contact and call the sendFormCommand', async () => {
            const contact = await sendFormCommand.execute({
                title: 'Test title',
                body: 'Test body',
                email: 'test@email.com',
            });
            expect(contact).toBeDefined();
        });
    });
});
