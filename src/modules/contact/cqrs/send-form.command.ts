import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IContactRepository } from '@domain/contact';
import { ContactDto } from '@infrastructure/contact/dto/contact.dto';

@Injectable()
export class SendFormCommand implements ICommand {
    constructor(private readonly contactRepository: IContactRepository) {}

    async execute(data: ContactDto): Promise<any> {
        const { id } = await this.contactRepository.create({
            ...data,
        });
        return id;
    }
}
