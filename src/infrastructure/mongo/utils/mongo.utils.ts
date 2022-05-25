/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FilterQuery } from 'mongoose';
import { isPlain } from '@common/utils';
import { FindCriteria } from '@core/repository.interface';

export function toMongoQuery<T>(criteria: FindCriteria<T & { id?: string; _id?: any }>): FilterQuery<T> {
    const operators = new Map([
        ['lte', '$lte'],
        ['lt', '$lt'],
        ['gt', '$gt'],
        ['gte', '$gte'],
        ['in', '$in'],
        ['nin', '$nin'],
        ['eq', '$eq'],
    ]);

    if (criteria?.id) {
        criteria._id = criteria.id;
        delete criteria.id;
    }

    const query: FilterQuery<T> = {};
    const stack = [[query, criteria]];

    while (stack.length) {
        const [target, source] = stack.pop()!;

        for (const [key, value] of Object.entries(source)) {
            if (isPlain(value)) {
                target[key] = {};
                stack.push([target[key], source[key]]);
                continue;
            }

            if (operators.has(key)) {
                target[operators.get(key)!] = source[key];
                continue;
            }

            target[key] = source[key];
        }
    }

    return query;
}
