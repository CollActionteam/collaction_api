import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollActionDocument } from '@common/utils/document.utils';
import { IUserInfo } from '@domain/core';
import { IPost } from '@domain/post/interface';
import { UserInfoPersistenceSchema } from './user-info.persistence';

export type PostDocument = CollActionDocument<PostPersistence>;
@Schema({ collection: 'posts', autoCreate: true, versionKey: false, timestamps: true })
export class PostPersistence implements Omit<IPost, 'id' | 'createdAt' | 'updatedAt'> {
    @Prop({ required: true })
    readonly threadId: string;

    @Prop({ required: true })
    readonly forumId: string;

    @Prop({ required: true })
    readonly subject: string;

    @Prop({ type: UserInfoPersistenceSchema, required: true })
    readonly author: IUserInfo;

    @Prop({ required: true })
    readonly message: string;

    @Prop({ required: true })
    readonly visible: boolean;
}
export const PostSchema = SchemaFactory.createForClass(PostPersistence);
