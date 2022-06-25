import { Injectable } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';
import { IParticipationRepository } from '@domain/participation';
import { ToggleParticipationDto, ToggleParticipationResponse } from '@infrastructure/participation';
import { ParticipationHasInvalidCommitmentOption, ParticipationRequiresCommitmentError } from '@modules/participation/error';
import { ICQRSHandler } from '@common/cqrs';
import { FindCrowdActionByIdQuery } from '@modules/crowdaction';

export interface ToggleParticipationCommandArgs {
    readonly userId: string;
    readonly toggleParticipation: ToggleParticipationDto;
}

@Injectable()
export class ToggleParticipationCommand implements ICommand {
    constructor(private readonly participationRepository: IParticipationRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async execute({ userId, toggleParticipation }: ToggleParticipationCommandArgs): Promise<ToggleParticipationResponse> {
        const [participation] = await this.participationRepository.findAll({ userId, crowdActionId: toggleParticipation.crowdActionId });

        if (participation) {
            await this.participationRepository.delete(participation.id);
            return { isParticipating: false };
        }

        if (!toggleParticipation.commitmentOptions || !toggleParticipation.commitmentOptions?.length) {
            throw new ParticipationRequiresCommitmentError();
        }

        const crowdAction = await this.cqrsHandler.fetch(FindCrowdActionByIdQuery, toggleParticipation.crowdActionId);
        const allowedCommitmentOptions = crowdAction.commitmentOptions.map((option) => option.id);

        this.isCommitmentOptionsAllowed(toggleParticipation.commitmentOptions, allowedCommitmentOptions);

        const { id } = await this.participationRepository.create({
            userId,
            crowdActionId: crowdAction.id,
            commitmentOptions: toggleParticipation.commitmentOptions,
            joinDate: new Date(),
            dailyCheckIns: 0,
        });

        return { isParticipating: true, participationId: id };
    }

    isCommitmentOptionsAllowed(selectedOptions: string[], allowedOptions: string[]): boolean {
        const invalidOptions: string[] = [];

        for (const option of selectedOptions) {
            if (!allowedOptions.includes(option)) {
                invalidOptions.push(option);
            }
        }

        if (invalidOptions.length) {
            throw new ParticipationHasInvalidCommitmentOption(invalidOptions);
        }

        return true;
    }
}
