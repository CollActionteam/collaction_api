import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdAction, ICrowdActionImages } from '@domain/crowdaction';
import { Country, CountrySchema } from '@infrastructure/mongo/persistence/country.persistence';
import { IBadge } from '@domain/badge';
import { CollActionDocument } from '@common/utils/document.utils';
import { ICommitment } from '@domain/commitment';
import { CrowdActionBadgePersistenceSchema } from './badge.persistence';
import { CommitmentSchema } from './commitment.persistence';

export interface IBadgeConfig {
    diamondTreshold: number;
}

export class BadgeConfig implements IBadgeConfig {
    constructor(public diamondTreshold: number) {}
}

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
    @Prop({ required: true })
    readonly title: string;

    @Prop({ required: true })
    readonly description: string;

    @Prop({ type: String, required: true })
    readonly category: string;

    @Prop({ type: String, required: false })
    readonly subcategory?: string;

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

    @Prop({ type: [CommitmentSchema], required: true, array: true })
    readonly commitments: ICommitment[];

    @Prop({ type: [CrowdActionBadgePersistenceSchema], required: false, array: true })
    readonly badges: IBadge[];

    @Prop({ type: Object, required: true })
    readonly badgeConfig: IBadgeConfig;
}
export const CrowdActionSchema = SchemaFactory.createForClass(CrowdActionPersistence);
