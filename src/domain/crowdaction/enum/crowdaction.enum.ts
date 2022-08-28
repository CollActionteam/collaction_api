export enum CrowdActionTypeEnum {
    FOOD = 'FOOD',
    WASTE = 'WASTE',
    ENERGY = 'ENERGY',
    BIKE = 'BIKE',
}

export enum CrowdActionCategoryEnum {
    SUSTAINABILITY = 'SUSTAINABILITY',
    FOOD = 'FOOD',
    ENERGY = 'ENERGY',
    WASTE = 'WASTE',
    ELECTIRICITY = 'ELECTIRICITY',
    TRANSPORT = 'TRANSPORT',
    HEALTH = 'HEALTH',
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
