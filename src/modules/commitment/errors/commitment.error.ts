import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types';

export class CommitmentDoesNotExistError extends ApiError {
    constructor(id: string) {
        super({ message: `Commitment with ID (${id}) does not exist!`, statusCode: HttpStatus.NOT_FOUND });
    }
}
