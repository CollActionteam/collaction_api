import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { ICommand, ICQRSHandler } from '@common/cqrs';
import { CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdActionRepository, BadgeConfig } from '@domain/crowdaction';
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
import { SchedulerService } from '@modules/scheduler';
import { Commitment } from '@domain/commitment';
import { CreateThreadCommand } from '@modules/thread/cqrs/command';
import { FindDefaultForumQuery } from '@modules/forum/cqrs/query/find-default-forum.query';

@Injectable()
export class CreateCrowdActionCommand implements ICommand {
    constructor(
        private readonly crowdActionRepository: ICrowdActionRepository,
        private readonly schedulerService: SchedulerService,
        private readonly cqrsHandler: ICQRSHandler,
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

        let slug = slugify(data.title, { lower: true, strict: true });
        const [crowdActionBySlug] = await this.crowdActionRepository.findAll({ slug });
        if (crowdActionBySlug) {
            slug = `${slug}-${Date.now().toString().substring(0, 10)}`;
        }

        const now = new Date();

        const commitments = data.commitments.map((c) => {
            return Commitment.create({ ...c, createdAt: now, updatedAt: now, id: uuidv4() });
        });

        const badgeConfig = new BadgeConfig({
            diamondThreshold: data.badgeConfig?.diamondThreshold ?? commitments.sort((a, b) => b.points - a.points)[0].points,
        });

        await this.#createThread(data);

        const crowdAction = await this.crowdActionRepository.create({
            ...data,
            commitments,
            participantCount: 0,
            joinEndAt,
            location,
            slug,
            joinStatus: joinEndAt < now ? CrowdActionJoinStatusEnum.CLOSED : CrowdActionJoinStatusEnum.OPEN,
            status: data.startAt < now ? CrowdActionStatusEnum.STARTED : CrowdActionStatusEnum.WAITING,
            images: {
                card: 'crowdaction-cards/placeholder.png',
                banner: 'crowdaction-banners/placeholder.png',
            },
            badgeConfig,
        });

        if (crowdAction) {
            this.schedulerService.createCron(crowdAction);
        }

        return crowdAction;
    }

    stopAllCrons() {
        this.schedulerService.stopAllCrons();
    }

    // TODO: Find way to pass userId and what is preficID suppoised to be?
    async #createThread(data: CreateCrowdActionDto) {
        const forum = await this.cqrsHandler.fetch(FindDefaultForumQuery, true);

        this.cqrsHandler.execute(CreateThreadCommand, {
            userId: '',
            forumId: forum.id,
            prefixId: '',
            subject: data.title,
            message: data.description,
        });
    }
}
