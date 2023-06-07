import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollActionDocument } from '@common/utils/document.utils';
import { IUserInfo } from '@domain/core';
import { ReportStatusEnum } from '@domain/post';
import { IPost } from '@domain/post/interface';
import { UserInfoPersistenceSchema } from './user-info.persistence';

export type ReportedPostDocument = CollActionDocument<ReportedPostPersistence>;
@Schema({ collection: 'reported-posts', autoCreate: true, versionKey: false, timestamps: true })
export class ReportedPostPersistence implements Omit<IPost, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: true })
    readonly threadId: string;

    @Prop({ required: true })
    readonly forumId: string;

    @Prop({ type: UserInfoPersistenceSchema, required: true })
    readonly author: IUserInfo;

    @Prop({ required: true })
    readonly postId: string;

    @Prop({ required: true })
    readonly reason: string;

    @Prop({ required: false })
    readonly handledById?: string;

    @Prop({ enum: ReportStatusEnum, required: true })
    readonly status: ReportStatusEnum;

    @Prop({ required: false })
    readonly subject: string;

    @Prop({ required: false })
    readonly message: string;

    @Prop({ required: false })
    readonly visible: boolean;
}
export const ReportedPostSchema = SchemaFactory.createForClass(ReportedPostPersistence);
