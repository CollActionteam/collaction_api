import { AwardTypeEnum, BadgeTierEnum } from '../enum/badge.enum';

export class Badge {
    readonly tier: BadgeTierEnum;
    readonly awardType: AwardTypeEnum;
    readonly minimumCheckIns: number;
}
