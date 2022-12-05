import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ILastPostInfo, IPostInfo, IUserInfo } from '@domain/core';

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

@Schema({ versionKey: false })
class UserInfoPersistence implements IUserInfo {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true })
    avatar: string;

    @Prop({ required: true })
    threadCount: number;

    @Prop({ required: true })
    postCount: number;
}
export const UserInfoPersistenceSchema = SchemaFactory.createForClass(UserInfoPersistence);

@Schema({ _id: false, versionKey: false })
class LastPostInfoPersistence implements ILastPostInfo {
    @Prop({ type: PostInfoPersistenceSchema, required: true })
    postInfo: IPostInfo;

    @Prop({ type: UserInfoPersistenceSchema, required: true })
    userInfo: IUserInfo;
}
export const LastPostInfoPersistenceSchema = SchemaFactory.createForClass(LastPostInfoPersistence);
