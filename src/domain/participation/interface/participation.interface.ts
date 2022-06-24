export interface IParticipation {
    readonly id: string;
    readonly crowdActionId: string;
    readonly userId: string;
    readonly commitmentOptions: string[];
    readonly joinDate: Date;
    readonly dailyCheckIns: number;
}
