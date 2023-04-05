import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IForumPermission } from '@domain/forum';
import { CollActionDocument } from '@common/utils/document.utils';
import { UserRole } from '@domain/auth/enum';

export type ForumPermissionDocument = CollActionDocument<ForumPermissionPersistence>;
@Schema({ collection: 'forums-permission', autoCreate: true, versionKey: false, timestamps: true })
export class ForumPermissionPersistence implements Omit<IForumPermission, 'id'> {
    @Prop({ required: true })
    readonly forumId: string;

    @Prop({ required: true })
    readonly role: UserRole;

    @Prop({ required: true })
    readonly createThreads: boolean;

    @Prop({ required: true })
    readonly createPosts: boolean;

    @Prop({ required: true })
    readonly canLike: boolean;

    @Prop({ required: true })
    readonly canDeleteThreads: boolean;

    @Prop({ required: true })
    readonly canDeleteOwnThreads: boolean;

    @Prop({ required: true })
    readonly canDeletePosts: boolean;

    @Prop({ required: true })
    readonly canDeleteOwnPosts: boolean;

    @Prop({ required: true })
    readonly canEditThreads: boolean;

    @Prop({ required: true })
    readonly canEditPosts: boolean;

    @Prop({ required: true })
    readonly canEditOwnThreads: boolean;

    @Prop({ required: true })
    readonly canEditOwnPosts: boolean;

    @Prop({ required: true })
    readonly canPostPolls: boolean;

    @Prop({ required: true })
    readonly canVotePolls: boolean;
}
export const ForumPermissionSchema = SchemaFactory.createForClass(ForumPermissionPersistence);
