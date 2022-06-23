import { CrowdActionCategoryEnum } from '@domain/crowdaction';

export interface ICommitmentOption {
    readonly id: string;
    readonly category: CrowdActionCategoryEnum;
    readonly label: string;
    readonly description: string;
    readonly points: number;
    readonly blocks: string[]; // IDs of other CommitmentOptions to be blocked
}
