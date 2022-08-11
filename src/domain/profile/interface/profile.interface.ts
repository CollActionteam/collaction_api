import { Country } from '@common/country';
import { Badge } from '@domain/badge';

export interface IProfile {
    readonly id: string;
    readonly userId: string;
    readonly location: Country;
    readonly firstName: string;
    readonly lastName?: string;
    readonly bio?: string | undefined;
    readonly avatar?: string | undefined;
    readonly badges?: Badge[] | undefined;
}
