import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IProfileRepository } from '@domain/profile';
import { Badge } from '@domain/badge';
import { Identifiable } from '@domain/core';

interface AwardBadgeData {
    userId: string;
    badge: Badge;
}

@Injectable()
export class AwardBadgeCommand implements ICommand {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async execute(data: AwardBadgeData): Promise<Identifiable> {
        const [profile] = await this.profileRepository.findAll({ userId: data.userId });

        const badges = profile.badges ?? [];
        badges.push(data.badge);

        await this.profileRepository.patch(profile.id, { badges });

        return { id: profile.id };
    }
}
