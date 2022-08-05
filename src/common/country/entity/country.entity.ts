import { ICountry } from '@common/country';

export class Country implements ICountry {
    readonly name: string;
    readonly code: string;

    constructor(entityLike: ICountry) {
        this.name = entityLike.name;
        this.code = entityLike.code;
    }

    static create(entityLike: ICountry): Country {
        return new Country(entityLike);
    }
}
