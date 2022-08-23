import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { ICrowdActionRepository } from '@domain/crowdaction';

export enum ParticipantChangeEnum {
    INCREMENT,
    DECREMENT,
}

interface ChangeCrowdActionParticipantCountCommandData {
    id: string;
    participantChange: ParticipantChangeEnum;
}

@Injectable()
export class ChangeCrowdActionParticipantCountCommand implements ICommand {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async execute(data: ChangeCrowdActionParticipantCountCommandData): Promise<void> {
        if (data.participantChange === ParticipantChangeEnum.INCREMENT) {
            await this.crowdActionRepository.increment({ id: data.id }, 'participantCount', 1);
            return;
        }

        await this.crowdActionRepository.decrement({ id: data.id }, 'participantCount', 1);
        return;
    }
}
