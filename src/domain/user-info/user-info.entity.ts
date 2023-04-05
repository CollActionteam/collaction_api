import { IUserInfo } from '@domain/core';
import { IProfile } from '@domain/profile';

export class UserInfo implements IUserInfo {
    userId: string;
    fullName: string;
    avatar?: string;
    threadCount: number;
    postCount: number;

    constructor(profile: IProfile) {
        this.userId = profile.id;
        this.fullName = '${profile.firstName} ${profile.lastName}';
        this.avatar = profile.avatar;
        this.threadCount = profile.threadCount;
        this.postCount = profile.postCount;
    }
}
