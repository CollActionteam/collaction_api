import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollActionDocument } from '@common/utils/document.utils';
import { UserRole } from '@domain/auth/enum';
import { IThreadPrefix } from '@domain/thread';

export type ThreadPrefixDocument = CollActionDocument<ThreadPrefixPersistence>;
@Schema({ collection: 'threadprefix', autoCreate: true, versionKey: false, timestamps: true })
export class ThreadPrefixPersistence implements Omit<IThreadPrefix, 'id'> {
    @Prop({ required: true })
    readonly prefix: string;

    @Prop({ array: true, required: true })
    readonly forumIds: [string];

    @Prop({ array: true, required: true })
    readonly roles: [UserRole];
}
export const ThreadPrefixPersistenceSchema = SchemaFactory.createForClass(ThreadPrefixPersistence);
