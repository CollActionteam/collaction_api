import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from '@common/types';
import { toHttpException } from '@common/utils';

@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
    catch(apiError: ApiError, host: ArgumentsHost): void | Error {
        const res: Response = host.switchToHttp().getResponse();
        const exception = toHttpException(apiError);

        res.status(exception.getStatus());
        res.json(exception.getResponse());
    }
}
