import { Injectable } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';
import { IParticipationRepository } from '@domain/participation';
import { ToggleParticipationDto, ToggleParticipationResponse } from '@infrastructure/participation';
import { CrowdActionDeosNotExistError, ParticipationRequiresCommitmentError } from '@modules/participation/error';
import { CommitmentOptionsMustBelongToCrowdActionTypeError, TYPE_TO_ALLOWED_OPTIONS } from '@modules/crowdaction';
import { CommitmentOptionEnum, ICrowdActionRepository } from '@domain/crowdaction';

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

        const allowedCommitmentOptions = TYPE_TO_ALLOWED_OPTIONS.get(crowdAction.type);
        const invalidCommitmentOptions = toggleParticipation.commitmentOptions.filter(
            (option: CommitmentOptionEnum) => !allowedCommitmentOptions?.includes(option),
        );

        if (invalidCommitmentOptions.length) {
            throw new CommitmentOptionsMustBelongToCrowdActionTypeError(crowdAction.type, invalidCommitmentOptions);
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
