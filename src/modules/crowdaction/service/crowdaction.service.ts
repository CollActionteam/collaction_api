import { Injectable } from '@nestjs/common';
import { CrowdAction, ICrowdActionRepository } from '@domain/crowdaction';
import { CrowdActionDoesNotExist } from '../errors';

@Injectable()
export class CrowdActionService {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async findByIdOrFail(id: string): Promise<CrowdAction> {
        const crowdAction = await this.crowdActionRepository.findOne({ id });

        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        return crowdAction;
        return this.crowdActionRepository.findOne({ id });
    }
}
