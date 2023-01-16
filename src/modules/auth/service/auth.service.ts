import { Injectable } from '@nestjs/common';
import { sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink } from 'firebase/auth';
import { UserRecord } from 'firebase-admin/auth';
import { AuthUser } from '@domain/auth/entity';
import { AuthToken, FirebaseAuthAdmin, FirebaseAuthClient } from '@infrastructure/auth';
import { UserRole } from '@domain/auth/enum';
import { AuthenticationError, BadCredentialsError, OnlyInviteOrganization } from '../errors';

@Injectable()
export class AuthService {
    constructor(private readonly adminAuth: FirebaseAuthAdmin, private readonly firebaseAuth: FirebaseAuthClient) {}

    async decodeAccessToken(idToken: string): Promise<AuthUser> {
        try {
            const { uid } = await this.adminAuth.verifyIdToken(idToken);

            const { users } = await this.adminAuth.getUsers([{ uid }]);
            const [user] = users.map(async (record) => {
                // TODO: Remove when users have claims
                if (!record.customClaims) {
                    await this.addDefaultClaims(record.uid);

                    if (record.phoneNumber) {
                        return AuthUser.create({ ...(record as any), customClaims: { role: UserRole.USER } });
                    }
                }

                if (record.customClaims) {
                    return AuthUser.create(record as any);
                }

                throw new AuthenticationError(`User is missing phoneNumber and/or Role`);
            });

            return user;
        } catch (error) {
            throw new AuthenticationError();
        }
    }

    async addDefaultClaims(uid: string) {
        await this.adminAuth.setCustomUserClaims(uid, { role: UserRole.USER });
    }

    async signIn(email: string, password: string): Promise<AuthToken> {
        try {
            // TODO: AuthRepository - Check if user is Disabled
            const credentials = await signInWithEmailAndPassword(this.firebaseAuth, email, password);

            if (!credentials.user) {
                throw new BadCredentialsError();
            }

            const accessToken = await credentials.user.getIdToken();
            return { accessToken };
        } catch (error) {
            throw new AuthenticationError(error.message);
        }
    }

    async inviteAdmin(email: string): Promise<void> {
        if (!email.includes('@collaction.org')) {
            throw new OnlyInviteOrganization();
        }

        let customClaims: any;
        let role: string | undefined | null;

        let userRecord: UserRecord | undefined = undefined;
        try {
            userRecord = await this.adminAuth.getUserByEmail(email);
        } catch {}

        if (userRecord != null) {
            customClaims = userRecord.customClaims;
        }

        if (customClaims != undefined) {
            role = customClaims['role'];
        }

        const actionCodeSettings = {
            url: `${process.env.ADMINCMS_URL}/verification`,
            handleCodeInApp: true,
        };

        if (role == 'ADMIN') {
            throw new AuthenticationError('User is already an admin');
        }

        await sendSignInLinkToEmail(this.firebaseAuth, email, actionCodeSettings);
    }

    async verifyEmail(email: string, url: string): Promise<VerifyEmailResponse> {
        const credential = await signInWithEmailLink(this.firebaseAuth, email, url);

        const uid = credential.user.uid;
        const token = await credential.user.getIdToken(true);

        await this.adminAuth.setCustomUserClaims(uid, { role: UserRole.ADMIN });

        return { identifier: credential.user.uid, token };
    }

    async updatePassword(user: AuthUser, password: string): Promise<void> {
        await this.adminAuth.updateUser(user.uid, { password });
    }
}

export interface VerifyEmailResponse {
    identifier: string;
    token: string;
}
