import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ICommand, ICQRSHandler, IQuery } from '@common/cqrs/cqrs.interface';
import { TClass } from '@common/utils';

@Injectable()
export class CQRSHandler implements ICQRSHandler {
    constructor(private readonly modRef: ModuleRef) {}

    async execute<U, R>(command: TClass<ICommand<U, R>>, arg: U): Promise<R> {
        const commandInstance = this.modRef.get(command, { strict: false });
        return commandInstance.execute(arg);
    }

    async fetch<U, R>(query: TClass<IQuery<U, R>>, arg: U): Promise<R> {
        const queryInstance = this.modRef.get(query, { strict: false });
        return queryInstance.handle(arg);
    }
}
