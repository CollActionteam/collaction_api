import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { CrowdAction, ICrowdActionRepository } from '@domain/crowdaction';
import { CrowdActionDoesNotExist } from '@modules/crowdaction';

@Injectable()
export class FindCrowdActionBySlugQuery implements IQuery<string> {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async handle(slug: string): Promise<CrowdAction> {
        const [crowdAction] = await this.crowdActionRepository.findAll({ slug });

        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        return CrowdAction.create({ ...crowdAction });
    }
}
