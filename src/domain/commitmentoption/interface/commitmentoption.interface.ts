export interface ICommitmentOption {
    readonly id: string;
    readonly type: string;
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other CommitmentOptions to be blocked
    readonly icon: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
