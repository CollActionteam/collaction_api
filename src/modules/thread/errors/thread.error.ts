import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types';

export class ForumDoesNotExistError extends ApiError {
    constructor() {
        super({ message: `Forum does not exist`, statusCode: HttpStatus.NOT_FOUND });
    }
}

export class UserCannotCreateThreadInForumError extends ApiError {
    constructor() {
        super({ message: `User cannot create thread in forum`, statusCode: HttpStatus.BAD_REQUEST });
    }
}
