import { Request } from 'express';
import { ExecutionContext } from '@nestjs/common';
import { AuthUser } from '@domain/auth/entity';
import { AuthenticationError } from '@modules/auth/errors';
import { isObject } from '@common/utils';

const REQUEST_CONTEXT_TOKEN = '__requestContextToken__';

export type RequestContextMetadata = {
    readonly body: Request['body'];
    readonly params: Request['params'];
    readonly query: Request['query'];
    readonly headers: Record<string, string | string[] | void>;
};

export type RequestAuthorization = {
    readonly user: AuthUser;
};

export class RequestContext {
    private readonly metadata: RequestContextMetadata;
    private readonly _authorization?: RequestAuthorization;

    protected constructor(metadata: RequestContextMetadata) {
        this.metadata = metadata;
    }

    get body(): Record<string, any> {
        return this.metadata.body as Record<string, any>;
    }

    get params(): Record<string, any> {
        return this.metadata.params;
    }

    get query(): Record<string, any> {
        return this.metadata.query;
    }

    get headers(): Record<string, string | string[] | void> {
        return this.metadata.headers;
    }

    get authorization(): RequestAuthorization {
        if (!this._authorization) {
            throw new AuthenticationError();
        }

        return this._authorization;
    }

    authorize(user: AuthUser): RequestContext {
        if (this.authorized) {
            return this;
        }

        Object.defineProperty(this, '_authorization', { value: { user }, enumerable: true });

        return this;
    }

    get authorized(): boolean {
        return !(this._authorization === undefined || this._authorization === null);
    }

    static attach(target: unknown, metadata: RequestContextMetadata): RequestContext {
        if (!isObject(target)) {
            throw new Error('RequestContext can only be attached to an object.');
        }

        if (target[REQUEST_CONTEXT_TOKEN] instanceof this) {
            return target[REQUEST_CONTEXT_TOKEN] as RequestContext;
        }

        return (target[REQUEST_CONTEXT_TOKEN] = new RequestContext(metadata));
    }

    static create(ctx: ExecutionContext): RequestContext {
        const request: Request = ctx.switchToHttp().getRequest();
        return RequestContext.attach(request, {
            body: request.body as Record<string, any>,
            params: request.params,
            query: request.query,
            headers: request.headers,
        });
    }
}
