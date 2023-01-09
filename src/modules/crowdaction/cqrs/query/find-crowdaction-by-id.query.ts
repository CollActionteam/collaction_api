import { Inject, Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { CrowdAction } from '@domain/crowdaction';
import { CrowdActionDoesNotExist, CrowdActionService } from '@modules/crowdaction';

@Injectable()
export class FindCrowdActionByIdQuery implements IQuery<string> {
    constructor(@Inject('CrowdActionService') private readonly crowdActionService: CrowdActionService) {}

    async handle(id: string): Promise<CrowdAction> {
        const crowdAction = await this.crowdActionService.findByIdOrFail(id);

        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        return CrowdAction.create({ ...crowdAction });
    }
}
