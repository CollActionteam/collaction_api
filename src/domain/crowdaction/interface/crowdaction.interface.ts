import { Country } from '@common/country';
import {
    CommitmentOptionEnum,
    CrowdActionCategoryEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
    CrowdActionTypeEnum,
} from '@domain/crowdaction';

export interface ICrowdActionImages {
    readonly card: string;
    readonly banner: string;
}

export interface ICrowdAction {
    readonly id: string;
    readonly type: CrowdActionTypeEnum;
    readonly title: string;
    readonly description: string;
    readonly category: CrowdActionCategoryEnum;
    readonly subcategory?: CrowdActionCategoryEnum;
    readonly location: Country;
    readonly password?: string;
    readonly participantCount: number;
    readonly images: ICrowdActionImages;
    readonly commitmentOptions: CommitmentOptionEnum[];
    readonly status: CrowdActionStatusEnum;
    readonly joinStatus: CrowdActionJoinStatusEnum;

    readonly startAt: Date;
    readonly endAt: Date;
    readonly joinEndAt: Date;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
