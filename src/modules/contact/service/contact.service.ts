import { Injectable } from '@nestjs/common';
import { Contact, IContactRepository } from '@domain/contact';
import { ContactDoesNotExistError } from '../errors/contact.error';

@Injectable()
export class ContactService {
    constructor(private readonly contactRepository: IContactRepository) {}

    async findByIdOrFail(id: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({ id });

        if (!contact) {
            throw new ContactDoesNotExistError(id);
        }
        return contact;
    }
}
