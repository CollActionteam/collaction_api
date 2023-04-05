import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { ICommand, ICQRSHandler } from '@common/cqrs';
import { ICrowdActionRepository, BadgeConfig } from '@domain/crowdaction';
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
import { Commitment } from '@domain/commitment';
import { CreateThreadCommand } from '@modules/thread/cqrs/command';
import { UserRole } from '@domain/auth/enum';
import { FindDefaultForumQuery } from '@modules/forum';

export interface ICreateCrowdActionArgs {
    userId: string;
    userRole: UserRole;
    crowdActionDto: CreateCrowdActionDto;
}

@Injectable()
export class CreateCrowdActionCommand implements ICommand {
    constructor(private readonly crowdActionRepository: ICrowdActionRepository, private readonly cqrsHandler: ICQRSHandler) {}

    async execute(args: ICreateCrowdActionArgs): Promise<Identifiable> {
        const uid = args.userId;
        const userRole = args.userRole;
        const data = args.crowdActionDto;

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

        await this.#createThread(uid, userRole, data);

        const crowdAction = await this.crowdActionRepository.create({
            ...data,
            commitments,
            participantCount: 0,
            joinEndAt,
            location,
            slug,
            images: {
                card: 'crowdaction-cards/placeholder.png',
                banner: 'crowdaction-banners/placeholder.png',
            },
            badgeConfig,
        });

        return crowdAction;
    }

    async #createThread(userId: string, userRole: UserRole, data: CreateCrowdActionDto) {
        const forum = await this.cqrsHandler.fetch(FindDefaultForumQuery, true);
        // TODO: Implement forum permission. Create forum permission if doesn't exi
        // const forumPermission = await this.cqrsHandler.fetch(FindForumPermissionByIdQuery, { forumId: forum.id, role: userRole });
        // if (forumPermission?.role !== userRole) throw new UserCannotCreateThreadInForumError();

        console.log(userRole);

        if (forum) {
            await this.cqrsHandler.execute(CreateThreadCommand, {
                userId: userId,
                forumId: forum.id,
                prefixId: undefined,
                subject: data.title,
                message: data.description,
            });
        }
    }
}
