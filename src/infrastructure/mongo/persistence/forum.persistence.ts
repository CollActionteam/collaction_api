import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ILastPostInfo } from '@domain/core';
import { ForumTypeEnum, IForum } from '@domain/forum';
import { LastPostInfoPersistenceSchema } from './lastpostinfo.persistence';

export type ForumDocument = ForumPersistence & Document;
@Schema({ collection: 'forums', autoCreate: true, versionKey: false, timestamps: true })
export class ForumPersistence implements Omit<IForum, 'id'> {
    @Prop({ enum: ForumTypeEnum, required: true })
    readonly type: ForumTypeEnum;

    @Prop({ required: true })
    readonly icon: string;

    @Prop({ required: true })
    readonly name: string;

    @Prop({ required: true })
    readonly description: string;

    @Prop({ required: false })
    readonly parentId?: string;

    @Prop({ array: true, required: false })
    readonly parentList?: [string];

    @Prop({ required: true })
    readonly displayOrder: number;

    @Prop({ required: true })
    readonly threadCount: number;

    @Prop({ required: true })
    readonly postCount: number;

    @Prop({ required: true })
    readonly visible: boolean;

    @Prop({ type: LastPostInfoPersistenceSchema, required: false })
    readonly lastPostInfo?: ILastPostInfo;
}
export const ForumSchema = SchemaFactory.createForClass(ForumPersistence);
