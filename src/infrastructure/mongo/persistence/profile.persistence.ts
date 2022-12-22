import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProfile } from '@domain/profile';
import { Badge } from '@domain/badge';
import { CollActionDocument } from '@common/utils/document.utils';
import { Country, CountrySchema } from './country.persistence';
import { CrowdActionBadgePersistenceSchema } from './badge.persistence';

export type ProfileDocument = CollActionDocument<ProfilePersistence>;

@Schema({ collection: 'profiles', autoCreate: true, versionKey: false, timestamps: true })
export class ProfilePersistence implements Omit<IProfile, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: true, unique: true })
    readonly userId: string;

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

    @Prop({ type: [CrowdActionBadgePersistenceSchema], array: true, required: false })
    readonly badges?: Badge[];
}
export const ProfileSchema = SchemaFactory.createForClass(ProfilePersistence);
