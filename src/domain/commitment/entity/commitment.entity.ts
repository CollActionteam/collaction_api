import { v4 as uuidv4 } from 'uuid';
import { ICommitment } from '../interface';

export class Commitment implements ICommitment {
    readonly _id: string = uuidv4();
    readonly tags: string[];
    readonly label: string;
    readonly description?: string | undefined;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other Commitments to be blocked
    readonly icon: string;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(entityLike: ICommitment) {
        this._id = entityLike._id;
        this.tags = entityLike.tags;
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
