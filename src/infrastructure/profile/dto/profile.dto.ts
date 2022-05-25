import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
    @ApiProperty({ name: 'phone', example: '+31612345678', required: true })
    readonly phone: string;

    @ApiProperty({ name: 'country', required: true })
    readonly country: string;

    @ApiProperty({ name: 'firstName', example: 'John', required: true })
    readonly firstName: string;

    @ApiProperty({ name: 'lastName', example: 'Doe', required: false })
    readonly lastName?: string;

    @ApiProperty({ name: 'bio', example: 'I am a cool guy', required: false })
    readonly bio?: string;
}

export class UpdateProfileDto extends ProfileDto {
    readonly userId: string;
}

export class CreateProfileDto extends ProfileDto {
    readonly userId: string;
}
