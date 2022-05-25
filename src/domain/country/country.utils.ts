/* eslint-disable import/no-named-as-default-member */
import countries from 'i18n-iso-countries';
import { Country } from '@common/country';

const DEFAULT_LANG = 'en';

export function getCountryByCode(code: string): Country {
    code = code.toUpperCase();
    const name = countries.getName(code, DEFAULT_LANG);

    return new Country({ code, name });
}
