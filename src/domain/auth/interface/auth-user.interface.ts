import { UserRole } from '../enum';

export type CustomClaims = {
    readonly role: UserRole;
};

export interface IAuthUser {
    readonly uid: string;
    readonly phoneNumber?: string | undefined;
    readonly disabled: boolean;
    readonly customClaims: CustomClaims;
    readonly tokensValidAfterTime?: string;
}
