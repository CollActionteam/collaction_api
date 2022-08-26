import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentOptionIconEnum } from '../enum/commitmentoption.enum';
import { ICommitmentOption } from '../interface';

export class CommitmentOption implements ICommitmentOption {
    readonly id: string;
    readonly type: CrowdActionTypeEnum;
    readonly label: string;
    readonly description: string;
    readonly points: number;
    readonly blocks?: string[]; // IDs of other CommitmentOptions to be blocked
    readonly icon: CommitmentOptionIconEnum;

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
