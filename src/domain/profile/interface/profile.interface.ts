import { Country } from '@common/country';

export interface IProfile {
    readonly id: string;
    readonly userId: string;
    readonly phone: string;
    readonly location: Country;
    readonly firstName: string;
    readonly lastName?: string;
    readonly bio?: string | undefined;
    readonly avatar?: string | undefined;
}
