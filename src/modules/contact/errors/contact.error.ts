import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types/errors/api.error';

export class ContactDoesNotExistError extends ApiError {
    constructor(id: string) {
        super({ message: `No contact exist with id ${id}`, statusCode: HttpStatus.NOT_FOUND });
    }
}
