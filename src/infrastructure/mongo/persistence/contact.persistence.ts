import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IContact } from '@domain/contact';
import { CollActionDocument } from '@common/utils/document.utils';

export type ContactDocument = CollActionDocument<ContactPersistence>;
@Schema({ collection: 'contacts', autoCreate: true, versionKey: false, timestamps: true })
export class ContactPersistence implements Omit<IContact, 'id'> {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    body: string;

    @Prop({ required: true })
    email: string;
}
export const ContactSchema = SchemaFactory.createForClass(ContactPersistence);
