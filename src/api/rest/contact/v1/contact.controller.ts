import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentifiableResponse } from '@api/rest/core';
import { ICQRSHandler } from '@common/cqrs';
import { UserRole } from '@domain/auth/enum';
import { Identifiable } from '@domain/core';
import { ContactDto } from '@infrastructure/contact/dto/contact.dto';
import { FirebaseGuard } from '@modules/auth/decorators';
import { SendFormCommand } from '@modules/contact/cqrs/send-form.command';

@Controller('v1/contact')
@ApiTags('Contact')
export class ContactController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Post()
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
    @ApiResponse({
        status: 201,
        description: '',
        type: IdentifiableResponse,
    })
    @ApiOperation({ summary: 'Send user feedback' })
    async sendFormData(@Body() contactBody: ContactDto): Promise<Identifiable> {
        const id = await this.cqrsHandler.execute(SendFormCommand, { ...contactBody });
        return id;
    }
}
