import { ICountry } from '@common/country';

export class Country implements ICountry {
    readonly name: string;
    readonly code: string;

    constructor();
    constructor(entityLike: ICountry);
    constructor(entityLike?: ICountry) {
        this.name = entityLike?.name ?? 'Netherlands';
        this.code = entityLike?.code ?? 'NL';
    }

    static create(entityLike: ICountry): Country {
        return new Country(entityLike);
    }

    static mock(): Country {
        return new Country();
    }
}
