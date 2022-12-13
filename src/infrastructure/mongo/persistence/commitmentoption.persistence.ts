import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICommitmentOption } from '@domain/commitmentoption';
import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';
import { CollActionDocument } from '@common/utils/document.utils';

export type CommitmentOptionDocument = CollActionDocument<CommitmentOptionPersistence>;

@Schema({ collection: 'commitmentoptions', autoCreate: true, versionKey: false, timestamps: true })
export class CommitmentOptionPersistence implements Omit<ICommitmentOption, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ enum: CrowdActionTypeEnum, required: true })
    readonly type: CrowdActionTypeEnum;

    @Prop({ required: true })
    readonly label: string;

    @Prop({ required: false })
    readonly description?: string;

    @Prop({ required: true })
    readonly points: number;

    @Prop({ array: true, required: false })
    readonly blocks?: string[];

    @Prop({ required: true })
    readonly icon: CommitmentOptionIconEnum;
}
export const CommitmentOptionSchema = SchemaFactory.createForClass(CommitmentOptionPersistence);

@Schema({ _id: false, versionKey: false })
class CrowdActionCommitmentOptionPersistence extends CommitmentOptionPersistence {
    @Prop({ required: true })
    readonly id: string;
}
export const CrowdActionCommitmentOptionSchema = SchemaFactory.createForClass(CrowdActionCommitmentOptionPersistence);
