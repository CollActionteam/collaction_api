import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/service';
import { AuthToken, SignInCredentialsDto } from '@infrastructure/auth';

@Controller('v1/auth')
@ApiTags('Authentication')
export class AuthenticationController {
    constructor(private readonly authService: AuthService) {}

    @Post('/sign-in')
    @ApiOkResponse({ type: AuthToken })
    async signIn(@Body() { email, password }: SignInCredentialsDto): Promise<AuthToken> {
        return this.authService.signIn(email, password);
    }
}
