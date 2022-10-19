import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IProfileRepository } from '@domain/profile';
import { Badge } from '@domain/badge';
import { Identifiable } from '@domain/core';

interface AwardBadgesData {
    userId: string;
    badges: Badge[];
}

@Injectable()
export class AwardBadgesCommand implements ICommand {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async execute(data: AwardBadgesData): Promise<Identifiable> {
        const [profile] = await this.profileRepository.findAll({ userId: data.userId });

        const badges = profile.badges ?? [];
        badges.push(...data.badges);

        await this.profileRepository.patch(profile.id, { badges });

        return { id: profile.id };
    }
}
