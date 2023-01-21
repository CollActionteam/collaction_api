import { CommitmentIconEnum } from '../enum/commitment.enum';
import { ICommitment } from '../interface';
import { v4 as uuidv4 } from 'uuid';

export class Commitment implements ICommitment {
    readonly id: string = uuidv4();
    readonly tag: string;
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other Commitments to be blocked
    readonly icon: CommitmentIconEnum;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(entityLike: ICommitment) {
        this.tag = entityLike.tag;
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
