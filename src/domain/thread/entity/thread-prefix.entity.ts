import { UserRole } from '@domain/auth/enum';
import { IThreadPrefix } from '../interface/thread-prefix.interface';

export class ThreadPrefix implements IThreadPrefix {
    readonly id: string;
    readonly prefix: string;
    readonly forumIds: [string];
    readonly roles: [UserRole];
}
