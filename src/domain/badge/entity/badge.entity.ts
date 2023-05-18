import { AwardTypeEnum, BadgeTierEnum } from '../enum';
import { IBadge, ICrowdActionMetaData } from '../interface/badge.interface';

export class CrowdActionMetaData implements ICrowdActionMetaData {
    readonly id: string;
    readonly title: string;

    constructor(entityLike: ICrowdActionMetaData) {
        this.id = entityLike.id;
        this.title = entityLike.title;
    }
}
export class Badge implements IBadge {
    readonly tier: BadgeTierEnum;
    readonly awardType: AwardTypeEnum;
    readonly minimumCheckIns: number;
    readonly accessibilityOutline?: string;
    readonly crowdActionMetaData?: ICrowdActionMetaData;

    constructor(entityLike: IBadge) {
        this.tier = entityLike.tier;
        this.awardType = entityLike.awardType;
        this.minimumCheckIns = entityLike.minimumCheckIns;
        this.accessibilityOutline = entityLike.accessibilityOutline;
        this.crowdActionMetaData = entityLike.metadata;
    }
}
