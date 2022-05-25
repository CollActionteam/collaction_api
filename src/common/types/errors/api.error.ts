export enum ErrorCodesEnum {
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    BAD_USER_INPUT = 'BAD_USER_INPUT',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    NOT_FOUND = 'NOT_FOUND',
}

export type ApiErrorOptions<T> = {
    readonly code?: ErrorCodesEnum;
    readonly data?: T;
    readonly message?: string;
};

export abstract class ApiError<T = Record<string, unknown>> extends Error {
    readonly code: ErrorCodesEnum;
    readonly data?: T;

    protected constructor({ message, code, data }: ApiErrorOptions<T>) {
        super(message);
        this.code = code ?? ErrorCodesEnum.INTERNAL_SERVER_ERROR;
        this.data = data;
    }
}
