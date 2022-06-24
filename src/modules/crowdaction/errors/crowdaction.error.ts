import { ApiError } from '@common/types/errors/api.error';

export class MustEndAfterStartError extends ApiError {
    constructor() {
        super({ message: `CrowdAction endAt must be later than its startAt` });
    }
}

export class MustJoinBeforeEndError extends ApiError {
    constructor() {
        super({ message: `CrowdAction joinEndAt must be later than its endAt` });
    }
}

export class CategoryAndSubcategoryMustBeDisimilarError extends ApiError {
    constructor() {
        super({ message: `Category and Subcategory must be disimilar` });
    }
}

export class CrowdActionMustBeInTheFutureError extends ApiError {
    constructor() {
        super({ message: `CrowdAction must start in the future, not the past` });
    }
}

export class CrowdActionDoesNotExist extends ApiError {
    constructor() {
        super({ message: `Could not find any CrowdAction that fit the criteria` });
    }
}
