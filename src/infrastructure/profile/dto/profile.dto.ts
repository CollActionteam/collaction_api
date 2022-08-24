import { ApiProperty } from '@nestjs/swagger';
import { ICountry } from '@common/country';

export class ProfileDto {
    @ApiProperty({ name: 'country', required: true })
    readonly country: string;

    @ApiProperty({ name: 'firstName', example: 'John', required: true })
    readonly firstName: string;

    @ApiProperty({ name: 'lastName', example: 'Doe', required: false })
    readonly lastName?: string;

    @ApiProperty({ name: 'bio', example: 'I am a cool guy', required: false })
    readonly bio?: string;
}

export class ProfileResponseDto {
    @ApiProperty({ name: 'id', example: '628cdea92e19fd912f0d520e', required: true })
    readonly id: string;

    @ApiProperty({ name: 'userId', example: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2', required: true })
    readonly userId: string;

    @ApiProperty({ name: 'location', example: { name: 'Netherlands', code: 'NL' }, required: true })
    readonly location: ICountry;

    @ApiProperty({ name: 'firstName', example: 'Mathias', required: true })
    readonly firstName: string;

    @ApiProperty({ name: 'lastName', example: 'M', required: true })
    readonly lastName: string;

    @ApiProperty({ name: 'bio', example: 'I am a cool guy aye', required: true })
    readonly bio: string;
}

export class UpdateProfileDto {
    @ApiProperty({ name: 'userId', example: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2', required: true })
    readonly userId: string;

    @ApiProperty({ name: 'country', required: false })
    readonly country?: string;

    @ApiProperty({ name: 'firstName', example: 'John', required: false })
    readonly firstName?: string;

    @ApiProperty({ name: 'lastName', example: 'Doe', required: false })
    readonly lastName?: string;

    @ApiProperty({ name: 'bio', example: 'I am a cool guy', required: false })
    readonly bio?: string;
}

export class CreateProfileDto extends ProfileDto {
    readonly userId: string;
}
