import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types';

export class ForumDoesNotExistError extends ApiError {
    constructor() {
        super({ message: `Forum does not exist`, statusCode: HttpStatus.NOT_FOUND });
    }
}

export class ForumPermissionDoesNotExistError extends ApiError {
    constructor() {
        super({ message: `Forum permission does not exist`, statusCode: HttpStatus.NOT_FOUND });
    }
}
