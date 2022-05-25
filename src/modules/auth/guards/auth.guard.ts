import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser } from '@domain/auth/entity';
import { RequestContext } from '@common/types/request.context';
import { getTokenFromRequestHeader } from '../utils';
import { AuthService } from '../service';
import { AuthenticationError } from '../errors';

const AUTHORIZATION_HEADER = 'authorization';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly reflector: Reflector) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const allowedRoles: Set<string> = new Set<string>([
            ...(this.reflector.get<string[]>('roles', ctx.getClass()) || []),
            ...(this.reflector.get<string[]>('roles', ctx.getHandler()) || []),
        ]);

        if (!allowedRoles) {
            return true;
        }

        const reqCtx: RequestContext = RequestContext.create(ctx);
        const token = reqCtx.headers[AUTHORIZATION_HEADER];

        let user;
        if (token && !reqCtx.authorized) {
            const accessToken = getTokenFromRequestHeader(token as string);
            user = await this.authenticate(accessToken);

            reqCtx.authorize(user);
        }

        if (allowedRoles.has(reqCtx.authorization.user.customClaims.role)) {
            return true;
        }

        throw new AuthenticationError('User is not authorized.');
    }

    private async authenticate(accessToken: string): Promise<AuthUser> {
        const user: AuthUser = await this.authService.decodeAccessToken(accessToken);

        if (user.disabled) {
            throw new AuthenticationError('User is disabled.');
        }

        return user;
    }
}
