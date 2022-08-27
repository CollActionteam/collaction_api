import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { IParticipationRepository, Participation } from '@domain/participation';
import { UserHasNoParticipations } from '@modules/participation/error';

@Injectable()
export class GetParticipationsForUserQuery implements IQuery {
    constructor(private readonly participationRepository: IParticipationRepository) {}

    async handle(userId: string): Promise<Participation[]> {
        const participations = await this.participationRepository.findAll({ userId: userId });

        if (!participations.length) {
            throw new UserHasNoParticipations();
        }

        return participations;
    }
}
