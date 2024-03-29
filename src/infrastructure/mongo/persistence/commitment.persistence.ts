import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollActionDocument } from '@common/utils/document.utils';
import { ICommitment } from '@domain/commitment';

export type CommitmentDocument = CollActionDocument<CommitmentPersistence>;

@Schema({ collection: 'commitments', autoCreate: true, versionKey: false, timestamps: true })
export class CommitmentPersistence implements Omit<ICommitment, 'id' | 'createdAt' | 'updatedAt'> {
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
    readonly icon: string;
}
export const CommitmentSchema = SchemaFactory.createForClass(CommitmentPersistence);
