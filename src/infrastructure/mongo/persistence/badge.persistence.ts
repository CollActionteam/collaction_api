import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AwardTypeEnum, BadgeTierEnum, IBadge, ICrowdActionMetaData } from '@domain/badge';

@Schema({ _id: false })
class CrowdActionBadgePersistence implements IBadge {
    @Prop({ enum: BadgeTierEnum, required: true })
    readonly tier: BadgeTierEnum;

    @Prop({ enum: AwardTypeEnum, required: true })
    readonly awardType: AwardTypeEnum;

    @Prop({ required: true })
    readonly minimumCheckIns: number;

    @Prop()
    readonly accessibilityOutline?: string;

    @Prop({ type: { id: { type: String }, title: { type: String } } })
    readonly usedByCrowdActions?: ICrowdActionMetaData;

    @Prop()
    readonly id: string;

    @Prop()
    readonly title: string;
}
export const CrowdActionBadgePersistenceSchema = SchemaFactory.createForClass(CrowdActionBadgePersistence);
