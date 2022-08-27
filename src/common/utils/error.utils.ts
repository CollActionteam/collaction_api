import {
    BadRequestException,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiError, ErrorCodesEnum } from '@common/types';

export const toHttpException = ({ code, data, message, name, stack, statusCode }: ApiError): HttpException => {
    const extentions = { data, type: name };
    const errorMap = new Map([
        [ErrorCodesEnum.UNAUTHENTICATED, new UnauthorizedException(message)],
        [ErrorCodesEnum.BAD_USER_INPUT, new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message, ...extentions })],
        [ErrorCodesEnum.NOT_FOUND, new NotFoundException({ statusCode: HttpStatus.NOT_FOUND, message, ...extentions })],
    ]);

    return (
        errorMap.get(code) ??
        new InternalServerErrorException({
            statusCode: statusCode,
            message,
            ...extentions,
            stacktrace: stack,
        })
    );
};
