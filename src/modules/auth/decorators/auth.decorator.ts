import { applyDecorators, createParamDecorator, ExecutionContext, PipeTransform, SetMetadata, Type, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestContext } from '@common/types/request.context';
import { AuthGuard } from '../guards';

type TFunction = () => void;

export function FirebaseGuard(
    ...roles: string[]
): <T extends TFunction, Y>(
    target: Record<string, any> | T,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
) => void {
    return applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard), ApiBearerAuth('Authorization'));
}

export const CurrentUser: (...pipes: (Type<PipeTransform> | PipeTransform)[]) => ParameterDecorator = createParamDecorator(
    (_, ctx: ExecutionContext) => RequestContext.create(ctx).authorization.user,
);
