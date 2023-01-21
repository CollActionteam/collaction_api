import { PollStatusEnum } from '../enum';
import { IPoll } from '../interface/poll.interface';

export class Poll implements IPoll {
    readonly id: string;
    readonly threadId: string;
    readonly question: string;
    readonly options: [string];
    readonly voteCount: number;
    readonly endAt: Date;
    readonly status: PollStatusEnum;
    readonly multiple: boolean;
}
