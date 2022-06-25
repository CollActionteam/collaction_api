import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { IParticipationRepository, Participation } from '@domain/participation';
import { UserIsNotParticipatingError } from '@modules/participation/error';

export interface IGetParticipationForCrowdActionArgs {
    userId: string;
    crowdActionId: string;
}

@Injectable()
export class GetParticipationForCrowdactionQuery implements IQuery {
    constructor(private readonly participationRepository: IParticipationRepository) {}

    async handle(args: IGetParticipationForCrowdActionArgs): Promise<Participation> {
        const [participation] = await this.participationRepository.findAll({ userId: args.userId, crowdActionId: args.crowdActionId });

        if (!participation) {
            throw new UserIsNotParticipatingError(args.crowdActionId);
        }

        return participation;
    }
}
