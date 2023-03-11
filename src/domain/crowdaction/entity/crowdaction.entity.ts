import { Country } from '@common/country';
import { Badge } from '@domain/badge/entity';
import { ICommitment } from '@domain/commitment';
import { Identifiable } from '@domain/core';
import { ICrowdAction, ICrowdActionImages, CrowdActionJoinStatusEnum, CrowdActionStatusEnum } from '@domain/crowdaction';
import { IBadgeConfig } from '@infrastructure/mongo';

export class CrowdAction implements ICrowdAction, Identifiable {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly category: string;
    readonly subcategory?: string;
    readonly location: Country;
    readonly slug: string;
    readonly password?: string;
    readonly participantCount: number;
    readonly images: ICrowdActionImages;
    readonly commitments: ICommitment[];
    readonly badgeConfig: IBadgeConfig;
    status: CrowdActionStatusEnum;
    joinStatus: CrowdActionJoinStatusEnum;

    readonly startAt: Date;
    readonly endAt: Date;

    // If no joinEndAt then let people join until the day before the CrowdAction ends
    // Note: Field not exposed to clients, see CrowdActionJoinStatusEnum (joinStatus) instead
    readonly joinEndAt: Date;

    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly badges?: Badge[];

    constructor(entityLike: ICrowdAction) {
        this.id = entityLike.id;
        this.title = entityLike.title;
        this.description = entityLike.description;
        this.category = entityLike.category;
        this.subcategory = entityLike.subcategory;
        this.location = entityLike.location;
        this.slug = entityLike.slug;
        this.password = entityLike.password;
        this.participantCount = entityLike.participantCount;
        this.images = entityLike.images;
        this.commitments = entityLike.commitments;

        // TODO: Remove from Entity, move to response and pseudo the variables with logic
        this.status = entityLike.status;
        this.joinStatus = entityLike.joinStatus;

        this.startAt = entityLike.startAt;
        this.endAt = entityLike.endAt;
        this.joinEndAt = entityLike.joinEndAt;
        this.createdAt = entityLike.createdAt;
        this.updatedAt = entityLike.updatedAt;

        this.badges = entityLike.badges;
    }

    static create(entityLike: ICrowdAction): CrowdAction {
        return new CrowdAction(entityLike);
    }

    updateStatuses(): CrowdAction {
        const now = new Date();
        this.status =
            this.endAt < now
                ? CrowdActionStatusEnum.ENDED
                : this.startAt > now
                ? CrowdActionStatusEnum.WAITING
                : CrowdActionStatusEnum.STARTED;
        this.joinStatus = this.joinEndAt < now ? CrowdActionJoinStatusEnum.CLOSED : CrowdActionJoinStatusEnum.OPEN;
        return this;
    }
}
