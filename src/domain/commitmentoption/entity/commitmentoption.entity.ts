import { CrowdActionCategoryEnum } from '@domain/crowdaction';
import { ICommitmentOption } from '../interface';

export class CommitmentOption implements ICommitmentOption {
    readonly id: string;
    readonly category: CrowdActionCategoryEnum;
    readonly label: string;
    readonly description: string;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other CommitmentOptions to be blocked

    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(entityLike: ICommitmentOption) {
        this.id = entityLike.id;
        this.category = entityLike.category;
        this.label = entityLike.label;
        this.description = entityLike.description;
        this.points = entityLike.points;
        this.blocks = entityLike.blocks;
        this.createdAt = entityLike.createdAt;
        this.updatedAt = entityLike.updatedAt;
    }

    static create(entityLike: ICommitmentOption) {
        return new CommitmentOption(entityLike);
    }
}