import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types/errors/api.error';

export class ProfileDoesNotExistError extends ApiError {
    constructor(id: string) {
        super({ message: `No profile exist with id ${id}`, statusCode: HttpStatus.NOT_FOUND });
    }
}
