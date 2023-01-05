import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentIconEnum } from '../enum/commitment.enum';
import { ICommitment } from '../interface';

export class Commitment implements ICommitment {
    readonly id: string;
    readonly type: CrowdActionTypeEnum;
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other Commitments to be blocked
    readonly icon: CommitmentIconEnum;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(entityLike: ICommitment) {
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

    static create(entityLike: ICommitment) {
        return new Commitment(entityLike);
    }
}
