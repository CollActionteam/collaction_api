import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICommitmentOption } from '@domain/commitmentoption';
import { CrowdActionCategoryEnum } from '@domain/crowdaction';

export type CommitmentOptionDocument = CommitmentOptionPersistence & Document;

@Schema({ collection: 'commitmentoptions', autoCreate: true, versionKey: false, timestamps: true })
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
