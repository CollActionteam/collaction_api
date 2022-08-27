import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types';

export class CommitmentOptionDoesNotExistError extends ApiError {
    constructor(id: string) {
        super({ message: `CommitmentOption with ID (${id}) does not exist!`, statusCode: HttpStatus.NOT_FOUND });
    }
}
