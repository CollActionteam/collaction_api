import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types/errors/api.error';

export class MustEndAfterStartError extends ApiError {
    constructor() {
        super({ message: `CrowdAction endAt must be later than its startAt`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class MustJoinBeforeEndError extends ApiError {
    constructor() {
        super({ message: `CrowdAction joinEndAt must be earlier than its endAt`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class CategoryAndSubcategoryMustBeDisimilarError extends ApiError {
    constructor() {
        super({ message: `Category and Subcategory must be disimilar`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class CrowdActionMustBeInTheFutureError extends ApiError {
    constructor() {
        super({ message: `CrowdAction must start in the future, not the past`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class CrowdActionDoesNotExist extends ApiError {
    constructor() {
        super({ message: `Could not find any CrowdAction that fit the criteria`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class CardAndOrBannerMissingError extends ApiError {
    constructor() {
        super({ message: `Card and/or Banner must be provided`, statusCode: HttpStatus.BAD_REQUEST });
    }
}
