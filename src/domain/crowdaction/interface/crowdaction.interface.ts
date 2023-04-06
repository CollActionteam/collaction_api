import { Country } from '@common/country';
import { Badge } from '@domain/badge/entity';
import { ICommitment } from '@domain/commitment';
import { IBadgeConfig } from '@domain/crowdaction';

export interface ICrowdActionImages {
    readonly card: string;
    readonly banner: string;
}

export interface ICrowdAction {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly subcategory?: string;
    readonly location: Country;
    readonly slug: string;
    readonly password?: string;
    readonly participantCount: number;
    readonly images: ICrowdActionImages;
    readonly commitments: ICommitment[];
    readonly badgeConfig: IBadgeConfig;

    readonly startAt: Date;
    readonly endAt: Date;
    readonly joinEndAt: Date;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly badges?: Badge[];

    readonly threadId?: string;
}
