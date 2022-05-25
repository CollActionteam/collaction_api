import { ApiError } from '@common/types';

export class CountryMustBeValidError extends ApiError {
    constructor(country: string) {
        super({ message: `Country ${country} is not valid` });
    }
}
