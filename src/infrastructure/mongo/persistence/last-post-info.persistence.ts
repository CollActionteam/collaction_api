import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILastPostInfo, IPostInfo, IUserInfo } from '@domain/core';
import { UserInfoPersistenceSchema } from './user-info.persistence';

@Schema({ versionKey: false })
class PostInfoPersistence implements IPostInfo {
    @Prop({ required: true })
    postId: string;

    @Prop({ required: true })
    title: string;

    @Prop({ type: Date, required: true })
    createdAt: Date;

    @Prop({ type: Date, required: true })
    updatedAt: Date;
}
export const PostInfoPersistenceSchema = SchemaFactory.createForClass(PostInfoPersistence);

@Schema({ _id: false, versionKey: false })
class LastPostInfoPersistence implements ILastPostInfo {
    @Prop({ type: PostInfoPersistenceSchema, required: true })
    postInfo: IPostInfo;

    @Prop({ type: UserInfoPersistenceSchema, required: true })
    userInfo: IUserInfo;
}
export const LastPostInfoPersistenceSchema = SchemaFactory.createForClass(LastPostInfoPersistence);
