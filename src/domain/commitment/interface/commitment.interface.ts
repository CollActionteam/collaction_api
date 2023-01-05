import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentIconEnum } from '../enum/commitment.enum';

export interface ICommitment {
    readonly id: string;
    readonly type: CrowdActionTypeEnum;
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other Commitments to be blocked
    readonly icon: CommitmentIconEnum;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
