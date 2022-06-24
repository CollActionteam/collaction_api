import { ApiError, ErrorCodesEnum } from '@common/types';

export class AuthenticationError extends ApiError {
    constructor(message: string = 'Unauthorized') {
        super({ message, code: ErrorCodesEnum.UNAUTHENTICATED });
    }
}

export class BadCredentialsError extends ApiError {
    constructor() {
        super({ message: 'Bad creddentials' });
    }
}
