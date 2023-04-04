import { IParticipation } from '../interface';

export class Participation implements IParticipation {
    readonly id: string;
    readonly crowdActionId: string;
    readonly userId: string;
    readonly fullName: string;
    readonly avatar?: string | undefined;
    readonly commitments: string[];
    readonly joinDate: Date;
    readonly dailyCheckIns: number;

    constructor(entityLike: IParticipation) {
        this.id = entityLike.id;
        this.crowdActionId = entityLike.crowdActionId;
        this.userId = entityLike.userId;
        this.fullName = entityLike.fullName;
        this.avatar = entityLike.avatar;
        this.commitments = entityLike.commitments;
        this.joinDate = entityLike.joinDate;
        this.dailyCheckIns = entityLike.dailyCheckIns;
    }

    static create(entityLike: IParticipation): Participation {
        return new Participation(entityLike);
    }
}
