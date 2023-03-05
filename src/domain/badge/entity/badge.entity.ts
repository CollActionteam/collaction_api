import { AwardTypeEnum, BadgeTierEnum } from '../enum';
import { IBadge, ICrowdActionMetadata } from '../interface/badge.interface';

export class CrowdActionMetadata implements ICrowdActionMetadata {
    readonly id: string;
    readonly title: string;

    constructor(entityLike: ICrowdActionMetadata) {
        this.id = entityLike.id;
        this.title = entityLike.title;
    }
}
export class Badge implements IBadge {
    readonly tier: BadgeTierEnum;
    readonly awardType: AwardTypeEnum;
    readonly minimumCheckIns: number;
    readonly accessibilityOutline?: string;
    readonly usedByCrowdActions?: CrowdActionMetadata[];

    constructor(entityLike: IBadge) {
        this.tier = entityLike.tier;
        this.awardType = entityLike.awardType;
        this.minimumCheckIns = entityLike.minimumCheckIns;
        this.accessibilityOutline = entityLike.accessibilityOutline;
        this.usedByCrowdActions = entityLike.usedByCrowdActions;
    }
}
