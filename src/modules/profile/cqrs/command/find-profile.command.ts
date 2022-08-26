import { Injectable } from '@nestjs/common';
import { IQuery } from '@common/cqrs';
import { Profile } from '@domain/profile';
import { ProfileDoesNotExistError } from '@modules/profile/errors';
import { ProfileService } from '@modules/profile/service';

@Injectable()
export class FindProfileByUserIdQuery implements IQuery {
    constructor(private readonly profileService: ProfileService) {}

    async handle(userId: string): Promise<Profile> {
        const profile = await this.profileService.findByUserIdOrFail(userId);

        if (!profile) {
            throw ProfileDoesNotExistError;
        }

        return profile;
    }
}
