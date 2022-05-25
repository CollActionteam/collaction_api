import { TClass } from '@common/utils';
import { DeepOptional } from '@core/repository.interface';

export interface IPagination {
    page?: number;
    pageSize?: number;
    total?: number;
}

export interface IPaginationQueryArgs<T> extends Pick<IPagination, 'page' | 'pageSize'> {
    readonly filter?: T;
    readonly sort?: DeepOptional<T>;
}

export interface ICommand<TArgs = any, TResult = any> {
    execute(args: TArgs): Promise<TResult>;
}

export interface IQuery<TArgs = any, TResult = any> {
    handle(args: TArgs): Promise<TResult>;
}

export abstract class ICQRSHandler {
    abstract execute<U, R>(command: TClass<ICommand<U, R>>, arg: U): Promise<R>;
    abstract fetch<U, R>(query: TClass<IQuery<U, R>>, arg: U): Promise<R>;
}
