import { BadgeTierEnum, AwardTypeEnum } from '../enum';

export interface IBadge {
    readonly tier: BadgeTierEnum;
    readonly awardType: AwardTypeEnum;
    readonly minimumCheckIns: number;
}
