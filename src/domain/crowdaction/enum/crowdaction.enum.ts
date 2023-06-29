import { FindCriteria } from '@core/index';
import { ICrowdAction } from '../interface';

export enum CrowdActionStatusEnum {
    WAITING = 'WAITING', // Period before CrowdAction Starts
    STARTED = 'STARTED',
    ENDED = 'ENDED',
}

export function statusToFilter(status: string) {
    const now = Date.now();

    if (status == CrowdActionStatusEnum.ENDED) {
        return { endAt: { lte: now } };
    } else if (status == CrowdActionStatusEnum.STARTED) {
        return { endAt: { gte: now }, startAt: { lte: now } };
    }

    return { startAt: { gte: now } };
}

export function statusesToFilter(statuses: string[]): FindCriteria<ICrowdAction> {
    let filter = {};

    if (statuses.length === 3) {
        return filter;
    }

    const now = Date.now();

    if (statuses.length == 1) {
        filter = statusToFilter(statuses[0]);
    } else {
        if (statuses.includes(CrowdActionStatusEnum.STARTED) && statuses.includes(CrowdActionStatusEnum.WAITING)) {
            filter['endAt'] = { gte: now };
        } else if (statuses.includes(CrowdActionStatusEnum.STARTED) && statuses.includes(CrowdActionStatusEnum.ENDED)) {
            filter['or'] = [{ startAt: { lte: now } }, { endAt: { lte: now } }];
        } else {
            filter['or'] = [{ endAt: { lte: now } }, { startAt: { gte: now } }];
        }
    }

    return filter;
}

export function joinStatusToFilter(status: CrowdActionJoinStatusEnum) {
    const now = Date.now();

    if (status == CrowdActionJoinStatusEnum.OPEN) {
        return { joinEndAt: { gte: now } };
    }

    return { joinEndAt: { lte: now } };
}

export enum CrowdActionJoinStatusEnum {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}
