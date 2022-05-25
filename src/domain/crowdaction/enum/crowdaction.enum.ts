export enum CrowdActionTypeEnum {
    FOOD = 'FOOD',
    WASTE = 'WASTE',
    ENERGY = 'ENERGY',
}

export enum CrowdActionCategoryEnum {
    SUSTAINABILITY = 'SUSTAINABILITY',
    FOOD = 'FOOD',
}

export enum CommitmentOptionEnum {
    // Food Related Commitment Options
    DAIRY_FREE = 'DAIRY_FREE',
    FIVE_SEVEN_DAYS = 'FIVE_SEVEN_DAYS',
    NO_BEEF = 'NO_BEEF',
    NO_CHEESE = 'NO_CHEESE',
    PESCETARIAN = 'PESCETARIAN',
    VEGAN = 'VEGAN',
    VEGETARIAN = 'VEGETARIAN',
    // Waste Related Commitment Options
    PLASTIC_FREE = 'PLASTIC_FREE',
    REUSABLE_WASTE = 'REUSABLE_WASTE',
    // Energy Related Commitment Options
    NEW_HEAT_PUMP = 'NEW_HEAT_PUMP',
    NEW_WINDOWS = 'NEW_WINDOWS',
    IMPROVED_ISOLATION = 'IMPROVED_ISOLATION',
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
