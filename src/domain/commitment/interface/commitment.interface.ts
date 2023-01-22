import { CommitmentIconEnum } from '../enum/commitment.enum';

export interface ICommitment {
    readonly _id: string;
    readonly tags: string[];
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other Commitments to be blocked
    readonly icon: CommitmentIconEnum;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
