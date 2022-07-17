import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AwardTypeEnum, BadgeTierEnum, IBadge } from '@domain/badge';

@Schema({ _id: false })
class CrowdActionBadgePersistence implements IBadge {
    @Prop({ enum: BadgeTierEnum, required: true })
    readonly tier: BadgeTierEnum;

    @Prop({ enum: AwardTypeEnum, required: true })
    readonly awardType: AwardTypeEnum;

    @Prop({ required: true })
    readonly minimumCheckIns: number;
}
export const CrowdActionBadgePersistenceSchema = SchemaFactory.createForClass(CrowdActionBadgePersistence);
