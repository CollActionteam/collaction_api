import { CustomClaims, IAuthUser } from '../interface';

export class AuthUser implements IAuthUser {
    readonly uid: string;
    readonly phoneNumber?: string | undefined;
    readonly disabled: boolean;
    readonly customClaims: CustomClaims;
    readonly tokensValidAfterTime?: string;

    constructor(entityLike: IAuthUser) {
        this.uid = entityLike.uid;
        this.phoneNumber = entityLike.phoneNumber;
        this.disabled = entityLike.disabled;
        this.customClaims = entityLike.customClaims;
        this.tokensValidAfterTime = entityLike.tokensValidAfterTime;
    }

    static create(entityLike: IAuthUser) {
        return new AuthUser(entityLike);
    }
}
