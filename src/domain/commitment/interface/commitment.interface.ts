export interface ICommitment {
    readonly id: string;
    readonly label: string;
    readonly description?: string | undefined;
    readonly tags: string[];
    readonly points: number;
    readonly blocks?: string[]; // IDs of other Commitments to be blocked
    readonly icon: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;
}
