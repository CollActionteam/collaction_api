import { CommitmentOptionEnum, CrowdActionTypeEnum } from '@domain/crowdaction';

const ALLOWED_FOOD_OPTIONS = [
    CommitmentOptionEnum.DAIRY_FREE,
    CommitmentOptionEnum.FIVE_SEVEN_DAYS,
    CommitmentOptionEnum.NO_BEEF,
    CommitmentOptionEnum.NO_CHEESE,
    CommitmentOptionEnum.PESCETARIAN,
    CommitmentOptionEnum.VEGAN,
    CommitmentOptionEnum.VEGETARIAN,
];

const ALLOWED_WASTE_OPTIONS = [CommitmentOptionEnum.PLASTIC_FREE, CommitmentOptionEnum.REUSABLE_WASTE];

const ALLOWED_ENERGY_OPTIONS = [CommitmentOptionEnum.NEW_HEAT_PUMP, CommitmentOptionEnum.NEW_WINDOWS];

export const TYPE_TO_ALLOWED_OPTIONS = new Map<CrowdActionTypeEnum, CommitmentOptionEnum[]>([
    [CrowdActionTypeEnum.FOOD, ALLOWED_FOOD_OPTIONS],
    [CrowdActionTypeEnum.WASTE, ALLOWED_WASTE_OPTIONS],
    [CrowdActionTypeEnum.ENERGY, ALLOWED_ENERGY_OPTIONS],
]);
