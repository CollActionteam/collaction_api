import { Injectable } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';
import { IParticipationRepository } from '@domain/participation';
import { ToggleParticipationDto, ToggleParticipationResponse } from '@infrastructure/participation';
import { ParticipationHasInvalidCommitment, ParticipationRequiresCommitmentError } from '@modules/participation/error';
import { ICQRSHandler } from '@common/cqrs';
import { FindCrowdActionByIdQuery } from '@modules/crowdaction';
import {
    IncrementParticipantCountCommand,
    ParticipantChangeEnum,
} from '@modules/crowdaction/cqrs/command/increment-participant-count.command';
import { FindProfileByUserIdQuery } from '@modules/profile/cqrs';

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
            this.cqrsHandler.execute(IncrementParticipantCountCommand, {
                id: participation.crowdActionId,
                participantChange: ParticipantChangeEnum.DECREMENT,
            });

            return { isParticipating: false };
        }

        if (!toggleParticipation.commitments || !toggleParticipation.commitments?.length) {
            throw new ParticipationRequiresCommitmentError();
        }

        const profile = await this.cqrsHandler.fetch(FindProfileByUserIdQuery, userId);

        const crowdAction = await this.cqrsHandler.fetch(FindCrowdActionByIdQuery, toggleParticipation.crowdActionId);
        const allowedCommitments = crowdAction.commitments.map((option) => option._id);

        this.isCommitmentsAllowed(toggleParticipation.commitments, allowedCommitments);

        const { id } = await this.participationRepository.create({
            userId,
            fullName: profile.firstName + ' ' + profile.lastName,
            avatar: profile.avatar,
            crowdActionId: crowdAction.id,
            commitments: toggleParticipation.commitments,
            joinDate: new Date(),
            dailyCheckIns: 0,
        });

        this.cqrsHandler.execute(IncrementParticipantCountCommand, {
            id: crowdAction.id,
            participantChange: ParticipantChangeEnum.INCREMENT,
        });
        return { isParticipating: true, participationId: id };
    }

    isCommitmentsAllowed(selectedOptions: string[], allowedOptions: string[]): boolean {
        const invalidOptions: string[] = [];

        for (const option of selectedOptions) {
            if (!allowedOptions.includes(option)) {
                invalidOptions.push(option);
            }
        }

        if (invalidOptions.length) {
            throw new ParticipationHasInvalidCommitment(invalidOptions);
        }

        return true;
    }
}
