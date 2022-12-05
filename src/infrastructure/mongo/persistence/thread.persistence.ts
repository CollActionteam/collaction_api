import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserInfo, ILastPostInfo } from '@domain/core';
import { IThread } from '@domain/thread';
import { CollActionDocument } from '@common/utils/document.utils';
import { LastPostInfoPersistenceSchema, UserInfoPersistenceSchema } from './last-post-info.persistence';

export type ThreadDocument = CollActionDocument<ThreadPersistence>;
@Schema({ collection: 'threads', autoCreate: true, versionKey: false, timestamps: true })
export class ThreadPersistence implements Omit<IThread, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: true })
    prefixId: string;

    @Prop({ required: true })
    forumId: string;

    @Prop({ required: true })
    firstPost: string;

    @Prop({ required: false })
    pollId?: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    message: string;

    @Prop({ type: UserInfoPersistenceSchema, required: true })
    author: IUserInfo;

    @Prop({ required: true })
    closed: boolean;

    @Prop({ required: true })
    stickied: boolean;

    @Prop({ required: true })
    visible: boolean;

    @Prop({ required: true })
    replyCount: number;

    @Prop({ type: LastPostInfoPersistenceSchema, required: true })
    lastPostInfo: ILastPostInfo;
}
export const ThreadPersistenceSchema = SchemaFactory.createForClass(ThreadPersistence);
