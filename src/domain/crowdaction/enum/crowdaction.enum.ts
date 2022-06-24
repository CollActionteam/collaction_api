export enum CrowdActionTypeEnum {
    FOOD = 'FOOD',
    WASTE = 'WASTE',
    ENERGY = 'ENERGY',
}

export enum CrowdActionCategoryEnum {
    SUSTAINABILITY = 'SUSTAINABILITY',
    FOOD = 'FOOD',
}

export enum CrowdActionStatusEnum {
    WAITING = 'WAITING', // Period before CrowdAction Starts
    STARTED = 'STARTED',
    ENDED = 'ENDED',
}

export enum CrowdActionJoinStatusEnum {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
}
