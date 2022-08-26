export interface IParticipation {
    readonly id: string;
    readonly crowdActionId: string;
    readonly userId: string;
    readonly fullName: string;
    readonly avatar?: string | undefined;
    readonly commitmentOptions: string[];
    readonly joinDate: Date;
    readonly dailyCheckIns: number;
}
