import { Injectable } from '@nestjs/common';
import { CrowdAction, ICrowdActionRepository } from '@domain/crowdaction';

@Injectable()
export class CrowdActionService {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async findByIdOrFail(id: string): Promise<CrowdAction> {
        return this.crowdActionRepository.findOne({ id });
    }
}
