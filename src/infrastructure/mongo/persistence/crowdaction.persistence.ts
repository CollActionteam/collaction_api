import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
    CrowdActionCategoryEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
    CrowdActionTypeEnum,
    ICrowdAction,
    ICrowdActionImages,
} from '@domain/crowdaction';
import { Country, CountrySchema } from '@infrastructure/mongo/persistence/country.persistence';
import { ICommitmentOption } from '@domain/commitmentoption';
import { IBadge } from '@domain/badge';
import { CrowdActionCommitmentOptionSchema } from './commitmentoption.persistence';
import { CrowdActionBadgePersistenceSchema } from './badge.persistence';

@Schema({ _id: false, versionKey: false })
class CrowdActionImages implements ICrowdActionImages {
    @Prop({ required: true })
    readonly card: string;

    @Prop({ required: true })
    readonly banner: string;
}
export const CrowdActionImagesSchema = SchemaFactory.createForClass(CrowdActionImages);

export type CrowdActionDocument = CrowdActionPersistence & Document;
@Schema({ collection: 'crowdactions', autoCreate: true, versionKey: false, timestamps: true })
export class CrowdActionPersistence implements Omit<ICrowdAction, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ enum: CrowdActionTypeEnum, required: true })
    readonly type: CrowdActionTypeEnum;

    @Prop({ required: true })
    readonly title: string;

    @Prop({ required: true })
    readonly description: string;

    @Prop({ type: String, enum: CrowdActionCategoryEnum, required: true })
    readonly category: CrowdActionCategoryEnum;

    @Prop({ type: String, enum: CrowdActionCategoryEnum, required: false })
    readonly subcategory?: CrowdActionCategoryEnum;

    @Prop({ type: CountrySchema, required: true })
    readonly location: Country;

    @Prop({ required: false })
    readonly password?: string;

    @Prop({ required: true })
    readonly slug: string;

    @Prop({ required: true })
    readonly participantCount: number;

    @Prop({ type: CrowdActionImagesSchema, required: true })
    readonly images: CrowdActionImages;

    @Prop({ type: String, enum: CrowdActionStatusEnum, required: true })
    readonly status: CrowdActionStatusEnum;

    @Prop({ type: String, enum: CrowdActionJoinStatusEnum, required: true })
    readonly joinStatus: CrowdActionJoinStatusEnum;

    @Prop({ type: Date, required: true })
    readonly startAt: Date;

    @Prop({ type: Date, required: true })
    readonly endAt: Date;

    @Prop({ type: Date, required: true })
    readonly joinEndAt: Date;

    @Prop({ type: [CrowdActionCommitmentOptionSchema], required: true, array: true })
    readonly commitmentOptions: ICommitmentOption[];

    @Prop({ type: [CrowdActionBadgePersistenceSchema], required: false, array: true })
    readonly badges: IBadge[];
}
export const CrowdActionSchema = SchemaFactory.createForClass(CrowdActionPersistence);
