import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollActionDocument } from '@common/utils/document.utils';
import { IPoll, PollStatusEnum } from '@domain/poll';

export type PollSchema = CollActionDocument<PollPersistence>;
@Schema({ collection: 'polls', autoCreate: true, versionKey: false, timestamps: true })
export class PollPersistence implements Omit<IPoll, 'id'> {
    @Prop({ required: true })
    readonly threadId: string;

    @Prop({ required: true })
    readonly question: string;

    @Prop({ type: [String], required: true })
    readonly options: [string];

    @Prop({ required: true })
    readonly voteCount: number;

    @Prop({ type: Date, required: true })
    readonly endAt: Date;

    @Prop({ enum: PollStatusEnum, required: true })
    readonly status: PollStatusEnum;

    @Prop({ required: true })
    readonly multiple: boolean;
}
export const PollPersistenceSchema = SchemaFactory.createForClass(PollPersistence);
