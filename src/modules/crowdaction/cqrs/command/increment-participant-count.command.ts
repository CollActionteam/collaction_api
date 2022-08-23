import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { ICrowdActionRepository } from '@domain/crowdaction';

export enum ParticipantChangeEnum {
    INCREMENT,
    DECREMENT,
}

interface IncrementData {
    id: string;
    participantChange: ParticipantChangeEnum;
}

@Injectable()
export class IncrementParticipantCountCommand implements ICommand {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async execute(data: IncrementData): Promise<void> {
        if (data.participantChange === ParticipantChangeEnum.INCREMENT) {
            await this.crowdActionRepository.increment({ id: data.id }, 'participantCount');
            return;
        }

        await this.crowdActionRepository.increment({ id: data.id }, 'participantCount', -1);
        return;
    }
}
