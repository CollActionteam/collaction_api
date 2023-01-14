import { HttpStatus } from '@nestjs/common';
import { ApiError, ErrorCodesEnum } from '@common/types';

export class AuthenticationError extends ApiError {
    constructor(message: string = 'Unauthorized') {
        super({ message, code: ErrorCodesEnum.UNAUTHENTICATED, statusCode: HttpStatus.UNAUTHORIZED });
    }
}

export class BadCredentialsError extends ApiError {
    constructor() {
        super({ message: 'Bad creddentials', statusCode: HttpStatus.UNAUTHORIZED });
    }
}

export class OnlyInviteOrganization extends ApiError {
    constructor() {
        super({ message: 'Can only invite organization members', statusCode: HttpStatus.BAD_REQUEST });
    }
}
