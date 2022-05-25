import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IProfileRepository } from '@domain/profile';
import { Identifiable } from '@domain/core';
import { UpdateProfileDto } from '@infrastructure/profile';
import { getCountryByCode } from '@domain/country';
import { CountryMustBeValidError } from '@modules/core';

@Injectable()
export class UpdateProfileCommand implements ICommand {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async execute(data: UpdateProfileDto): Promise<Identifiable> {
        const { id, location } = await this.profileRepository.findOne({ userId: data.userId });

        let newLocation = location;
        if (data.country) {
            newLocation = getCountryByCode(data.country);
            if (!location.name) {
                throw new CountryMustBeValidError(data.country);
            }
        }

        await this.profileRepository.patch(id, { ...data, location: newLocation });
        return { id };
    }
}
