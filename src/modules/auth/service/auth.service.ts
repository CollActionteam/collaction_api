import { Injectable } from '@nestjs/common';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthUser } from '@domain/auth/entity';
import { AuthToken, FirebaseAuthAdmin, FirebaseAuthClient } from '@infrastructure/auth';
import { UserRole } from '@domain/auth/enum';
import { AuthenticationError, BadCredentialsError } from '../errors';

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

                if (record.phoneNumber && record.customClaims) {
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
}
