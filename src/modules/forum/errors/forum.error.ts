import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types';

export class ForumDoesNotExistError extends ApiError {
    constructor() {
        super({ message: `Default Forum does not exist!`, statusCode: HttpStatus.NOT_FOUND });
    }
}
