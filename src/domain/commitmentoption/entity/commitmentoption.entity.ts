import { ICommitmentOption } from '../interface';

export class CommitmentOption implements ICommitmentOption {
    readonly id: string;
    readonly type: string;
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other CommitmentOptions to be blocked
    readonly icon: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(entityLike: ICommitmentOption) {
        this.id = entityLike.id;
        this.type = entityLike.type;
        this.label = entityLike.label;
        this.description = entityLike.description;
        this.points = entityLike.points;
        this.blocks = entityLike.blocks;
        this.icon = entityLike.icon;
        this.createdAt = entityLike.createdAt;
        this.updatedAt = entityLike.updatedAt;
    }

    static create(entityLike: ICommitmentOption) {
        return new CommitmentOption(entityLike);
    }
}
