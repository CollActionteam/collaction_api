import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICommitmentOption } from '@domain/commitmentoption';
import { CollActionDocument } from '@common/utils/document.utils';

export type CommitmentOptionDocument = CollActionDocument<CommitmentOptionPersistence>;

@Schema({ collection: 'commitmentoptions', autoCreate: true, versionKey: false, timestamps: true })
export class CommitmentOptionPersistence implements Omit<ICommitmentOption, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: true })
    readonly type: string;

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
export const CommitmentOptionSchema = SchemaFactory.createForClass(CommitmentOptionPersistence);

@Schema({ _id: false, versionKey: false })
class CrowdActionCommitmentOptionPersistence extends CommitmentOptionPersistence {
    @Prop({ required: true })
    readonly id: string;
}
export const CrowdActionCommitmentOptionSchema = SchemaFactory.createForClass(CrowdActionCommitmentOptionPersistence);
