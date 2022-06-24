import { CrowdActionTypeEnum } from '@domain/crowdaction';

export interface ICommitmentOption {
    readonly id: string;
    readonly type: CrowdActionTypeEnum;
    readonly label: string;
    readonly description: string;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other CommitmentOptions to be blocked

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
