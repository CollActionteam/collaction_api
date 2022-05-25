import { CommitmentOptionEnum } from '@domain/crowdaction';

export interface IParticipation {
    readonly id: string;
    readonly crowdActionId: string;
    readonly userId: string;
    readonly commitmentOptions: CommitmentOptionEnum[];
    readonly joinDate: Date;
    readonly dailyCheckIns: number;
}
