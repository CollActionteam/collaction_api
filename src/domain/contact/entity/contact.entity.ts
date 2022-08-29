import { IContact } from '../interface/contact.interface';

export class Contact implements IContact {
    readonly id: string;
    readonly title: string;
    readonly body: string;

    constructor(entity: IContact) {
        this.id = entity.id;
        this.title = entity.title;
        this.body = entity.body;
    }

    static create(entityLike: IContact): Contact {
        return new Contact(entityLike);
    }
}
