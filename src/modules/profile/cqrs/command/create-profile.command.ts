import { Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IProfileRepository } from '@domain/profile';
import { getCountryByCode } from '@domain/country';
import { CreateProfileDto } from '@infrastructure/profile';
import { CountryMustBeValidError } from '@modules/core';

@Injectable()
export class CreateProfileCommand implements ICommand {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async execute(data: CreateProfileDto): Promise<string> {
        const location = getCountryByCode(data.country);
        if (!location.name) {
            throw new CountryMustBeValidError(data.country);
        }

        const { id } = await this.profileRepository.create({ ...data, location, userId: data.userId });
        return id;
    }
}
