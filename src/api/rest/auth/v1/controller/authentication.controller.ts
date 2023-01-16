import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, VerifyEmailResponse } from '@modules/auth/service';
import { AuthToken, InviteAdminDto, SignInCredentialsDto } from '@infrastructure/auth';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { AuthUser } from '@domain/auth/entity';
import { UserRole } from '@domain/auth/enum';
import { ApiSuccessResponse } from '@api/rest/core';

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
    @ApiBody({
        type: InviteAdminDto,
    })
    @ApiOkResponse()
    @HttpCode(200)
    async inviteAdmin(@Body() { email }: { email: string }): Promise<ApiSuccessResponse> {
        await this.authService.inviteAdmin(email);
        return { status: 200 };
    }

    @Post('/verify-email')
    @ApiOkResponse()
    async verifyEmail(@Body() { email, url }: { email: string; url: string }): Promise<VerifyEmailResponse> {
        return this.authService.verifyEmail(email, url);
    }

    @Post('/update-password')
    @FirebaseGuard(UserRole.ADMIN)
    @ApiOkResponse()
    @HttpCode(200)
    async updatePassword(@CurrentUser() user: AuthUser, @Body() { password }: { password: string }): Promise<ApiSuccessResponse> {
        await this.authService.updatePassword(user, password);
        return { status: 200 };
    }
}
