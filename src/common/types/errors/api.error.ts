import { HttpStatus } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

export enum ErrorCodesEnum {
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    BAD_USER_INPUT = 'BAD_USER_INPUT',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    NOT_FOUND = 'NOT_FOUND',
}

export type ApiErrorOptions<T> = {
    readonly code?: ErrorCodesEnum;
    readonly data?: T;
    readonly statusCode?: ErrorHttpStatusCode;
    readonly message?: string;
};

export abstract class ApiError<T = Record<string, unknown>> extends Error {
    readonly code: ErrorCodesEnum;
    readonly statusCode?: ErrorHttpStatusCode;
    readonly data?: T;

    protected constructor({ message, code, statusCode, data }: ApiErrorOptions<T>) {
        super(message);
        this.code = code ?? ErrorCodesEnum.INTERNAL_SERVER_ERROR;
        this.statusCode = statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
        this.data = data;
    }
}
