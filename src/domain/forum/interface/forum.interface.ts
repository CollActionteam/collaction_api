import { ILastPostInfo } from '@domain/core';
import { ForumTypeEnum } from '../enum/forum.enum';

export interface IForum {
    readonly id: string;
    readonly type: ForumTypeEnum;
    readonly icon: string;
    readonly name: string;
    readonly description: string;
    readonly parentId?: string;
    readonly parentList?: [string];
    readonly displayOrder: number;
    readonly threadCount: number;
    readonly postCount: number;
    readonly visible: boolean;
    readonly lastPostInfo?: ILastPostInfo;
}
