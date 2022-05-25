import { Injectable } from '@nestjs/common';
import { AuthUser } from '@domain/auth/entity';
import { FirebaseAuthAdmin } from '@infrastructure/auth';
import { UserRole } from '@domain/auth/enum';
import { AuthenticationError } from '../errors';

@Injectable()
export class AuthService {
    constructor(private readonly adminAuth: FirebaseAuthAdmin) {}

    async decodeAccessToken(idToken: string): Promise<AuthUser> {
        try {
            const { uid } = await this.adminAuth.verifyIdToken(idToken);

            const { users } = await this.adminAuth.getUsers([{ uid }]);
            const [user] = users.map(async (record) => {
                // Note: This is a workaround to give users without a claim the User Role
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
}
