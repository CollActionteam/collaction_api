import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IParticipation } from '@domain/participation';

export type ParticipationDocument = ParticipationPersistence & Document;
@Schema({ collection: 'participations', autoCreate: true, versionKey: false, timestamps: true })
export class ParticipationPersistence implements Omit<IParticipation, 'id'> {
    @Prop({ required: true })
    readonly crowdActionId: string;

    @Prop({ required: true })
    readonly userId: string;

    @Prop({ required: true })
    readonly fullName: string;

    @Prop({ required: false })
    readonly avatar?: string;

    @Prop({ type: [String], required: true })
    readonly commitmentOptions: string[];

    @Prop({ type: Date, required: true })
    readonly joinDate: Date;

    @Prop({ required: true })
    readonly dailyCheckIns: number;
}
export const ParticipationSchema = SchemaFactory.createForClass(ParticipationPersistence);
