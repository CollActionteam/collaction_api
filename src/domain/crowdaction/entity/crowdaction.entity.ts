import { Country } from '@common/country';
import { Badge } from '@domain/badge/entity';
import { ICommitmentOption } from '@domain/commitmentoption';
import {
    ICrowdAction,
    ICrowdActionImages,
    CrowdActionCategoryEnum,
    CrowdActionTypeEnum,
    CrowdActionJoinStatusEnum,
    CrowdActionStatusEnum,
} from '@domain/crowdaction';

export class CrowdAction implements ICrowdAction {
    readonly id: string;
    readonly type: CrowdActionTypeEnum;
    readonly title: string;
    readonly description: string;
    readonly category: CrowdActionCategoryEnum;
    readonly subcategory?: CrowdActionCategoryEnum;
    readonly location: Country;
    readonly password?: string;
    readonly participantCount: number;
    readonly images: ICrowdActionImages;
    readonly commitmentOptions: ICommitmentOption[];
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
        this.type = entityLike.type;
        this.title = entityLike.title;
        this.description = entityLike.description;
        this.category = entityLike.category;
        this.subcategory = entityLike.subcategory;
        this.location = entityLike.location;
        this.password = entityLike.password;
        this.participantCount = entityLike.participantCount;
        this.images = entityLike.images;
        this.commitmentOptions = entityLike.commitmentOptions;

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
