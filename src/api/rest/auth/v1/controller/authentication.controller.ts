import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, VerifyEmailResponse } from '@modules/auth/service';
import { AuthToken, SignInCredentialsDto } from '@infrastructure/auth';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { AuthUser } from '@domain/auth/entity';
import { UserRole } from '@domain/auth/enum';

@Controller('v1/auth')
@ApiTags('Authentication')
export class AuthenticationController {
    constructor(private readonly authService: AuthService) {}

    @Post('/sign-in')
    @ApiOkResponse({ type: AuthToken })
    async signIn(@Body() { email, password }: SignInCredentialsDto): Promise<AuthToken> {
        return this.authService.signIn(email, password);
    }

    @Post('/invite-admin')
    @FirebaseGuard(UserRole.ADMIN)
    @ApiOkResponse()
    async inviteAdmin(@Body() { email }: { email: string }): Promise<String> {
        return this.authService.inviteAdmin(email);
    }

    @Post('/verify-email')
    @ApiOkResponse()
    async verifyEmail(@Body() { email, url }: { email: string, url: string }): Promise<VerifyEmailResponse> {
        return this.authService.verifyEmail(email, url);
    }
    
    @Post('/update-password')
    @ApiOkResponse()
    async updatePassword(@CurrentUser() user: AuthUser, @Body() { password }: { password: string }): Promise<void> {
        return this.authService.updatePassword(user, password);
    }
}
