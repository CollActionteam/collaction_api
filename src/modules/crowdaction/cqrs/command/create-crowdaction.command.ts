import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
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

@Injectable()
export class CreateCrowdActionCommand implements ICommand {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository) {}

    async execute(data: CreateCrowdActionDto): Promise<Identifiable> {
        if (new Date() < data.startAt) {
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

        const now = new Date();
        return await this.crowdActionRepository.create({
            ...data,
            participantCount: 0,
            joinEndAt,
            location,
            joinStatus: joinEndAt < now ? CrowdActionJoinStatusEnum.CLOSED : CrowdActionJoinStatusEnum.OPEN,
            status: data.startAt < now ? CrowdActionStatusEnum.STARTED : CrowdActionStatusEnum.WAITING,
        });
    }
}
