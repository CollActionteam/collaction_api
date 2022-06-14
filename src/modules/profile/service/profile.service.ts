import { Injectable } from '@nestjs/common';
import { IProfileRepository, Profile } from '@domain/profile';
import { ProfileDoesNotExistError } from '../errors';

@Injectable()
export class ProfileService {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async findByIdOrFail(id: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({ id });

        if (!profile) {
            throw new ProfileDoesNotExistError(id);
        }

        return profile;
    }

    async findByUserIdOrFail(userId: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({ userId });

        if (!profile) {
            throw new ProfileDoesNotExistError(userId);
        }

        return profile;
    }
}
