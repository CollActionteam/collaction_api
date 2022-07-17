import { AwardTypeEnum, BadgeTierEnum } from '../enum';
import { IBadge } from '../interface/badge.interface';

export class Badge implements IBadge {
    readonly tier: BadgeTierEnum;
    readonly awardType: AwardTypeEnum;
    readonly minimumCheckIns: number;

    constructor(entityLike: IBadge) {
        this.tier = entityLike.tier;
        this.awardType = entityLike.awardType;
        this.minimumCheckIns = entityLike.minimumCheckIns;
    }
}
