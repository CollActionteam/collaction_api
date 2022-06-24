import { Injectable } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';
import { IParticipationRepository } from '@domain/participation';
import { ToggleParticipationDto, ToggleParticipationResponse } from '@infrastructure/participation';
import { CrowdActionDeosNotExistError, ParticipationRequiresCommitmentError } from '@modules/participation/error';
import { ICrowdActionRepository } from '@domain/crowdaction';

export interface ToggleParticipationCommandArgs {
    readonly userId: string;
    readonly toggleParticipation: ToggleParticipationDto;
}

@Injectable()
export class ToggleParticipationCommand implements ICommand {
    constructor(
        private readonly participationRepository: IParticipationRepository,
        private readonly crowdActionRepository: ICrowdActionRepository,
    ) {}

    async execute({ userId, toggleParticipation }: ToggleParticipationCommandArgs): Promise<ToggleParticipationResponse> {
        const [participation] = await this.participationRepository.findAll({ userId, crowdActionId: toggleParticipation.crowdActionId });

        if (participation) {
            await this.participationRepository.delete(participation.id);
            return { isParticipating: false };
        }

        if (!toggleParticipation.commitmentOptions || !toggleParticipation.commitmentOptions.length) {
            throw new ParticipationRequiresCommitmentError();
        }

        const [crowdAction] = await this.crowdActionRepository.findAll({ id: toggleParticipation.crowdActionId });
        if (!crowdAction) {
            throw new CrowdActionDeosNotExistError();
        }

        const { id } = await this.participationRepository.create({
            userId,
            crowdActionId: toggleParticipation.crowdActionId,
            commitmentOptions: toggleParticipation.commitmentOptions,
            joinDate: new Date(),
            dailyCheckIns: 0,
        });

        return { isParticipating: true, participationId: id };
    }
}
