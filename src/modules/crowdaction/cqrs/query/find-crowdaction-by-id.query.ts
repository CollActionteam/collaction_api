import { Inject, Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { ICrowdAction } from '@domain/crowdaction';
import { CrowdActionDoesNotExist, CrowdActionService } from '@modules/crowdaction';

@Injectable()
export class FindCrowdActionByIdQuery implements IQuery<string> {
    constructor(@Inject('PCrowdActionService') private readonly crowdActionService: CrowdActionService) {}

    async handle(id: string): Promise<ICrowdAction> {
        const crowdAction = await this.crowdActionService.findByIdOrFail(id);

        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        return crowdAction;
    }
}
