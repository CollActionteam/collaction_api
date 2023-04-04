import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { SchedulerRegistry } from '@nestjs/schedule';
import { connect, Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ICQRSHandler, CQRSHandler, CQRSModule } from '@common/cqrs';
import { SchedulerService } from '@modules/scheduler';
import { ContactDto } from '@infrastructure/contact/dto/';
import { IContactRepository, Contact } from '@domain/contact';
import { ContactPersistence, ContactRepository, ContactSchema } from '@infrastructure/mongo';
import { ContactDoesNotExistError } from '@modules/contact/errors';
import { ContactService } from '../service';
import { SendFormCommand } from '../cqrs/send-form.command';

describe('SendFormCommand', () => {
    let contactService: ContactService;
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
                ContactService,
                { provide: ICQRSHandler, useClass: CQRSHandler },
                { provide: IContactRepository, useClass: ContactRepository },
                { provide: getModelToken(ContactPersistence.name), useValue: contactModel },
            ],
        }).compile();
        contactService = moduleRef.get<ContactService>(ContactService);
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

    describe('findByIdOrFail', () => {
        it('should find a contact using an id or fail', async () => {
            const newContact = await new contactModel(ContactStub()).save();
            const foundContact: Contact = await contactService.findByIdOrFail(newContact.id);
            expect(newContact.id).toBe(foundContact.id);
        });
        it('should return ContactDoesNotExistError', async () => {
            await new contactModel(ContactStub()).save();
            await expect(contactService.findByIdOrFail('63c14ec0403d3562d58bb708')).rejects.toThrowError(ContactDoesNotExistError);
        });
    });
});

export const ContactStub = (): Contact => {
    return {
        id: '63c14ec0403d3562d58bb708',
        title: 'test  title',
        body: 'test body',
        email: 'test@email.com',
    };
};
