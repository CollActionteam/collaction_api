import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export abstract class AuthToken {
    @ApiProperty()
    abstract readonly accessToken: string;
}

export abstract class SignInCredentialsDto {
    @ApiProperty()
    @IsEmail()
    abstract readonly email: string;

    @ApiProperty()
    abstract readonly password: string;
}

export abstract class InviteAdminDto {
    @ApiProperty({ name: 'email' })
    readonly email: String;
}
