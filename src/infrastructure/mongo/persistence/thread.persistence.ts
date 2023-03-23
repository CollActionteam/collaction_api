import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserInfo, ILastPostInfo } from '@domain/core';
import { IThread } from '@domain/thread';
import { CollActionDocument } from '@common/utils/document.utils';
import { LastPostInfoPersistenceSchema } from './last-post-info.persistence';
import { UserInfoPersistenceSchema } from './user-info.persistence';

export type ThreadDocument = CollActionDocument<ThreadPersistence>;
@Schema({ collection: 'threads', autoCreate: true, versionKey: false, timestamps: true })
export class ThreadPersistence implements Omit<IThread, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: false })
    readonly prefixId?: string;

    @Prop({ required: true })
    readonly forumId: string;

    @Prop({ required: true })
    readonly firstPost: string;

    @Prop({ required: false })
    readonly pollId?: string;

    @Prop({ required: true })
    readonly subject: string;

    @Prop({ required: true })
    readonly message: string;

    @Prop({ type: UserInfoPersistenceSchema, required: true })
    readonly author: IUserInfo;

    @Prop({ required: true })
    readonly closed: boolean;

    @Prop({ required: true })
    readonly stickied: boolean;

    @Prop({ required: true })
    readonly visible: boolean;

    @Prop({ required: true })
    readonly replyCount: number;

    @Prop({ type: LastPostInfoPersistenceSchema, required: true })
    readonly lastPostInfo: ILastPostInfo;
}
export const ThreadPersistenceSchema = SchemaFactory.createForClass(ThreadPersistence);
