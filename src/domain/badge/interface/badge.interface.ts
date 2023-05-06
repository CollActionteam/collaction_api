import { BadgeTierEnum, AwardTypeEnum } from '../enum';

export interface ICrowdActionMetaData {
    readonly id: string;
    readonly title: string;
}

export interface IBadge {
    readonly tier: BadgeTierEnum;
    readonly awardType: AwardTypeEnum;
    readonly minimumCheckIns: number;
    readonly accessibilityOutline?: string;
    readonly metadata?: ICrowdActionMetaData;
}
