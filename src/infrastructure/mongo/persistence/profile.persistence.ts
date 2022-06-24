import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProfile } from '@domain/profile';
import { Country, CountrySchema } from './country.persistence';

export type ProfileDocument = ProfilePersistence & Document;

@Schema({ collection: 'profiles', autoCreate: true, versionKey: false, timestamps: true })
export class ProfilePersistence implements Omit<IProfile, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: true, unique: true })
    readonly userId: string;

    @Prop({ required: true })
    readonly phone: string;

    @Prop({ type: CountrySchema, required: true })
    readonly location: Country;

    @Prop({ required: true })
    readonly firstName: string;

    @Prop({ required: false })
    readonly lastName?: string;

    @Prop({ required: false })
    readonly bio?: string;

    @Prop({ required: false })
    readonly avatar?: string;
}
export const ProfileSchema = SchemaFactory.createForClass(ProfilePersistence);
