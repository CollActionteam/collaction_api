import { Injectable } from '@nestjs/common';
import { ICQRSHandler, IQuery } from '@common/cqrs';
import { CrowdAction, ICrowdActionRepository } from '@domain/crowdaction';
import { CrowdActionDoesNotExist } from '@modules/crowdaction';
import { GetCommitmentsByType } from '@modules/commitment';

@Injectable()
export class FindCrowdActionBySlugQuery implements IQuery<string> {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async handle(slug: string): Promise<CrowdAction> {
        const [crowdAction] = await this.crowdActionRepository.findAll({ slug });

        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        const commitments = await this.cqrsHandler.fetch(GetCommitmentsByType, crowdAction.type);

        return CrowdAction.create({ ...crowdAction, commitments });
    }
}
