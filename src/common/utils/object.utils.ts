export type TClass<T = any> = new (...args: any[]) => T;

export const isObject = (o: unknown): o is Record<string, unknown> => 'object' === typeof o && o !== null;

export const isPlain = (o: unknown): o is Record<string, any> => {
    if (isObject(o)) {
        if ('undefined' === typeof o.constructor) return true;

        if (isObject(o.constructor.prototype) === false) return false;

        return Object.hasOwnProperty.call(o.constructor.prototype, 'isPrototypeOf') !== false;
    }

    return false;
};
