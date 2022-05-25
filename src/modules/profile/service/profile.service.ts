import { Injectable } from '@nestjs/common';
import { IProfileRepository, Profile } from '@domain/profile';

@Injectable()
export class ProfileService {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async findByIdOrFail(id: string): Promise<Profile> {
        return this.profileRepository.findOne({ id });
    }

    async findByUserIdOrFail(userId: string): Promise<Profile> {
        return this.profileRepository.findOne({ userId });
    }
}
