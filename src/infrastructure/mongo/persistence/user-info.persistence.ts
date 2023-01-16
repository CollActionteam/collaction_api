import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserInfo } from '@domain/core';

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
