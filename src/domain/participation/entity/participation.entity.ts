import { CommitmentOptionEnum } from '@domain/crowdaction';
import { IParticipation } from '../interface';

export class Participation implements IParticipation {
    readonly id: string;
    readonly crowdActionId: string;
    readonly userId: string;
    readonly commitmentOptions: CommitmentOptionEnum[];
    readonly joinDate: Date;
    readonly dailyCheckIns: number;

    constructor(entityLike: IParticipation) {
        this.id = entityLike.id;
        this.crowdActionId = entityLike.crowdActionId;
        this.userId = entityLike.userId;
        this.commitmentOptions = entityLike.commitmentOptions;
        this.joinDate = entityLike.joinDate;
        this.dailyCheckIns = entityLike.dailyCheckIns;
    }

    static create(entityLike: IParticipation): Participation {
        return new Participation(entityLike);
    }
}
