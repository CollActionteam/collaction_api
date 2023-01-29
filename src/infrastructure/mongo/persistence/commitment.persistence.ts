import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommitmentIconEnum } from '@domain/commitment/enum/commitment.enum';
import { CollActionDocument } from '@common/utils/document.utils';
import { ICommitment } from '@domain/commitment';

export type CommitmentDocument = CollActionDocument<CommitmentPersistence>;

@Schema({ collection: 'commitments', _id: false, autoCreate: true, versionKey: false, timestamps: true })
export class CommitmentPersistence implements Omit<ICommitment, 'createdAt' | 'updatedAt'> {
    @Prop({ required: true })
    readonly _id: string;

    @Prop({ array: true, required: true })
    readonly tags: string[];

    @Prop({ required: true })
    readonly label: string;

    @Prop({ required: false })
    readonly description?: string;

    @Prop({ required: true })
    readonly points: number;

    @Prop({ array: true, required: false })
    readonly blocks?: string[];

    @Prop({ required: true })
    readonly icon: CommitmentIconEnum;
}
export const CommitmentSchema = SchemaFactory.createForClass(CommitmentPersistence);
