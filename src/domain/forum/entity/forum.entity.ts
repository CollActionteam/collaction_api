import { ILastPostInfo } from '@domain/core';
import { ForumTypeEnum } from '../enum/forum.enum';
import { IForum } from '../interface/forum.interface';

export class Forum implements IForum {
    readonly id: string;
    readonly type: ForumTypeEnum;
    readonly icon: string;
    readonly name: string;
    readonly description: string;
    readonly parentId?: string | undefined;
    readonly parentList?: [string] | undefined;
    readonly displayOrder: number;
    readonly threadCount: number;
    readonly postCount: number;
    readonly visible: boolean;
    readonly lastPostInfo?: ILastPostInfo;

    constructor(entityLike: IForum) {
        this.id = entityLike.id;
        this.type = entityLike.type;
        this.name = entityLike.name;
        this.description = entityLike.description;
        this.parentId = entityLike.parentId;
        this.parentList = entityLike.parentList;
        this.displayOrder = entityLike.displayOrder;
        this.threadCount = entityLike.threadCount;
        this.postCount = entityLike.postCount;
        this.visible = entityLike.visible;
        this.lastPostInfo = entityLike.lastPostInfo;
    }

    static create(entityLike: IForum): Forum {
        return new Forum(entityLike);
    }
}
