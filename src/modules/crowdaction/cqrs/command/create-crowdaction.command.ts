import { Injectable } from '@nestjs/common';
import { ICQRSHandler, ICommand } from '@common/cqrs';
import { CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdActionRepository } from '@domain/crowdaction';
import {
    CategoryAndSubcategoryMustBeDisimilarError,
    CrowdActionMustBeInTheFutureError,
    MustEndAfterStartError,
    MustJoinBeforeEndError,
} from '@modules/crowdaction/errors';
import { getCountryByCode } from '@domain/country/country.utils';
import { CountryMustBeValidError } from '@modules/core';
import { Identifiable } from '@domain/core';
import { CreateCrowdActionDto } from '@infrastructure/crowdaction';
import { GetCommitmentOptionsByType } from '@modules/commitmentoption';
import { CommitmentOption } from '@domain/commitmentoption';
import { SchedulerService } from '@modules/scheduler';

@Injectable()
export class CreateCrowdActionCommand implements ICommand {
    constructor(
        private readonly crowdActionRepository: ICrowdActionRepository,
        private readonly CQRSHandler: ICQRSHandler,
        private readonly schedulerService: SchedulerService,
    ) {}

    async execute(data: CreateCrowdActionDto): Promise<Identifiable> {
        if (new Date() > data.startAt) {
            throw new CrowdActionMustBeInTheFutureError();
        }

        if (data.startAt > data.endAt) {
            throw new MustEndAfterStartError();
        }

        let joinEndAt = data.joinEndAt;
        if (joinEndAt && joinEndAt > data.endAt) {
            throw new MustJoinBeforeEndError();
        }

        if (!joinEndAt) {
            joinEndAt = new Date(new Date(data.endAt).getTime() - 60 * 60 * 24 * 1000);
        }

        if (data.subcategory && data.category === data.subcategory) {
            throw new CategoryAndSubcategoryMustBeDisimilarError();
        }

        const location = getCountryByCode(data.country);
        if (!location.name) {
            throw new CountryMustBeValidError(data.country);
        }

        const commitmentOptions: CommitmentOption[] = await this.CQRSHandler.fetch(GetCommitmentOptionsByType, data.type);

        const now = new Date();
        const crowdAction = await this.crowdActionRepository.create({
            ...data,
            commitmentOptions,
            participantCount: 0,
            joinEndAt,
            location,
            joinStatus: joinEndAt < now ? CrowdActionJoinStatusEnum.CLOSED : CrowdActionJoinStatusEnum.OPEN,
            status: data.startAt < now ? CrowdActionStatusEnum.STARTED : CrowdActionStatusEnum.WAITING,
            images: {
                card: 'crowdaction-cards/placeholder.png',
                banner: 'crowdaction-banners/placeholder.png',
            },
        });

        if (crowdAction) {
            this.schedulerService.createCron(crowdAction);
        }

        return crowdAction;
    }

    stopAllCrons() {
        this.schedulerService.stopAllCrons();
    }
}
