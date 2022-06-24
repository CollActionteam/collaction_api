import { Country } from '@common/country';
import { IProfile } from '@domain/profile';

export class Profile implements IProfile {
    readonly id: string;
    readonly userId: string;
    readonly phone: string;
    readonly location: Country;
    readonly firstName: string;
    readonly lastName?: string | undefined;
    readonly bio?: string | undefined;
    readonly avatar?: string | undefined;

    constructor(entityLike: IProfile) {
        this.id = entityLike.id;
        this.userId = entityLike.userId;
        this.phone = entityLike.phone;
        this.location = entityLike.location;
        this.firstName = entityLike.firstName;
        this.lastName = entityLike.lastName;
        this.bio = entityLike.bio;
        this.avatar = entityLike.avatar;
    }

    static create(entityLike: IProfile): Profile {
        return new Profile(entityLike);
    }
}
