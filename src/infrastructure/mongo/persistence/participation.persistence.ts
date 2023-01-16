import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IParticipation } from '@domain/participation';
import { CollActionDocument } from '@common/utils/document.utils';

export type ParticipationDocument = CollActionDocument<ParticipationPersistence>;
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
