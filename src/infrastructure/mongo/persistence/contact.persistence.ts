import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IContact } from '@domain/contact';

export type ContactDocument = ContactPersistence & Document;
@Schema({ collection: 'contacts', autoCreate: true, versionKey: false, timestamps: true })
export class ContactPersistence implements Omit<IContact, 'id'> {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    body: string;
}
export const ContactSchema = SchemaFactory.createForClass(ContactPersistence);
