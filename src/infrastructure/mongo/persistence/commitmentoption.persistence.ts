import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ICommitmentOption } from '@domain/commitmentoption';
import { CrowdActionCategoryEnum } from '@domain/crowdaction';

export type CommitmentOptionDocument = CommitmentOptionPersistence & Document;
export class CommitmentOptionPersistence implements Omit<ICommitmentOption, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ enum: CrowdActionCategoryEnum, required: true })
    readonly category: CrowdActionCategoryEnum;

    @Prop({ required: true })
    readonly label: string;

    @Prop({ required: true })
    readonly description: string;

    @Prop({ required: true })
    readonly points: number;

    @Prop({ array: true, required: false })
    readonly blocks?: string[];
}
export const CommitmentOptionSchema = SchemaFactory.createForClass(CommitmentOptionPersistence);
