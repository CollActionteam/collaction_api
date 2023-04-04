import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IBadgeConfig } from '@domain/crowdaction';

@Schema({ _id: false, versionKey: false })
class BadgeConfigPersistence implements IBadgeConfig {
    @Prop({ required: true })
    readonly diamondThreshold: number;
}

export const BadgeConfigSchema = SchemaFactory.createForClass(BadgeConfigPersistence);
