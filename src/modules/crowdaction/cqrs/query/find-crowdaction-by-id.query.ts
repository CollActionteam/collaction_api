import { Inject, Injectable } from '@nestjs/common';
import { ICQRSHandler, IQuery } from '@common/cqrs';
import { CrowdAction } from '@domain/crowdaction';
import { CrowdActionDoesNotExist, CrowdActionService } from '@modules/crowdaction';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';

@Injectable()
export class FindCrowdActionByIdQuery implements IQuery<string> {
    constructor(
        @Inject('CrowdActionService') private readonly crowdActionService: CrowdActionService,
        private readonly cqrsHandler: ICQRSHandler,
    ) {}

    async handle(id: string): Promise<CrowdAction> {
        const crowdAction = await this.crowdActionService.findByIdOrFail(id);

        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        const commitmentOptions = await this.cqrsHandler.fetch(GetCommitmentOptionsByType, crowdAction.type);

        return CrowdAction.create({ ...crowdAction, commitmentOptions });
    }
}
