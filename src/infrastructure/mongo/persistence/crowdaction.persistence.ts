import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
    CrowdActionCategoryEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
    CrowdActionTypeEnum,
    ICrowdAction,
    ICrowdActionImages,
} from '@domain/crowdaction';
import { Country, CountrySchema } from '@infrastructure/mongo/persistence/country.persistence';
import { IBadge } from '@domain/badge';
import { CollActionDocument } from '@common/utils/document.utils';
import { CrowdActionCommitmentSchema } from './commitment.persistence';
import { CrowdActionBadgePersistenceSchema } from './badge.persistence';
import { ICommitment } from '@domain/commitment';

@Schema({ _id: false, versionKey: false })
class CrowdActionImages implements ICrowdActionImages {
    @Prop({ required: true })
    readonly card: string;

    @Prop({ required: true })
    readonly banner: string;
}
export const CrowdActionImagesSchema = SchemaFactory.createForClass(CrowdActionImages);

export type CrowdActionDocument = CollActionDocument<CrowdActionPersistence>;
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

    @Prop({ type: [CrowdActionCommitmentSchema], required: true, array: true })
    readonly commitments: ICommitment[];

    @Prop({ type: [CrowdActionBadgePersistenceSchema], required: false, array: true })
    readonly badges: IBadge[];
}
export const CrowdActionSchema = SchemaFactory.createForClass(CrowdActionPersistence);
