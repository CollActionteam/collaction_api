import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Identifiable } from '@domain/core';
import { ProfileService } from '@modules/profile';
import { CreateProfileDto, ProfileResponseDto, UpdateProfileDto } from '@infrastructure/profile';
import { ICQRSHandler } from '@common/cqrs';
import { CreateProfileCommand, UpdateProfileCommand, UploadProfileImageCommand } from '@modules/profile/cqrs/command';
import { IdentifiableResponse } from '@api/rest/core';
import { CurrentUser, FirebaseGuard } from '@modules/auth/decorators';
import { AuthUser } from '@domain/auth/entity';
import { Profile } from '@domain/profile';
import { UserRole } from '@domain/auth/enum';
import { UploadImageTypeEnum } from '@modules/core/s3/enum';

@Controller('v1/profiles')
@ApiTags('Profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService, private readonly cqrsHandler: ICQRSHandler) {}

    @Get('/me')
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiOperation({ summary: 'Retrieves an authenticated users profile' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found Profile if any',
        type: ProfileResponseDto,
    })
    async getAuthedProfile(@CurrentUser() user: AuthUser): Promise<Profile> {
        return await this.profileService.findByUserIdOrFail(user.uid);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Retrieve a profile by userId' })
    @ApiParam({ name: 'userId', required: true, example: 'O9pbPDY3s5e5XwzgwKZtZTDPvLS2' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found Profile if any',
        type: ProfileResponseDto,
    })
    async getProfile(@Param('userId') id: string): Promise<Profile> {
        return await this.profileService.findByUserIdOrFail(id);
    }

    // TODO: Consider Consolidating Post and Put Methods
    @Post()
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiResponse({
        status: 201,
        description: 'Returns the ID of the Profile',
        type: IdentifiableResponse,
    })
    @ApiOperation({ summary: 'Create a profile if does not exist by authenticated user' })
    async createProfile(@CurrentUser() user: AuthUser, @Body() createProfileBody: CreateProfileDto): Promise<Identifiable> {
        const id = await this.cqrsHandler.execute(CreateProfileCommand, { ...createProfileBody, userId: user.uid });
        return { id };
    }

    @Put()
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiResponse({
        status: 201,
        description: 'Returns the ID of the Profile',
        type: ProfileResponseDto,
    })
    @ApiOperation({ summary: 'Updates a users profile' })
    async updateProfile(@CurrentUser() user: AuthUser, @Body() updateProfileBody: UpdateProfileDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(UpdateProfileCommand, { ...updateProfileBody, userId: user.uid });
    }

    @Post('/me/image')
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async updateImage(@CurrentUser() user: AuthUser, @UploadedFile('file') file: any): Promise<void> {
        await this.cqrsHandler.execute(UploadProfileImageCommand, { file, id: user.uid, type: UploadImageTypeEnum.PROFILE });
    }
}
