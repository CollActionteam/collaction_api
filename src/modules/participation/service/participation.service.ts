import { Injectable } from '@nestjs/common';
import { Participation, IParticipationRepository } from '@domain/participation';
import { UserHasNoParticipations } from '@modules/participation/error';

@Injectable()
export class ParticipationService {
    constructor(private readonly participationRepository: IParticipationRepository) {}

    async findByIdOrFail(id: string): Promise<Participation> {
        const participation = await this.participationRepository.findOne({ id });

        if (!participation) {
            throw new UserHasNoParticipations();
        }

        return participation;
    }
}
