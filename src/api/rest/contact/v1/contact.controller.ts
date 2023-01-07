import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ICQRSHandler } from '@common/cqrs';
import { ContactDto } from '@infrastructure/contact/dto/contact.dto';
import { IContact } from '@domain/contact';
import { SendFormCommand } from '@modules/contact/cqrs/send-form.command';
import { PaginatedContactResponse } from '@infrastructure/contact';
import { Identifiable, IPaginatedList } from '@domain/core';
import { PaginationDto } from '@infrastructure/pagination';
import { ListContactsQuery } from '@modules/contact/cqrs/query/list-contacts.query';
import { FirebaseGuard } from '@modules/auth/decorators';
import { UserRole } from '@domain/auth/enum';

@Controller('v1/contact')
@ApiTags('Contact')
export class ContactController {
    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Get()
    @FirebaseGuard(UserRole.ADMIN, UserRole.MODERATOR)
    @ApiOperation({ summary: 'Retrieve a paginated list of CrowdActions' })
    @ApiResponse({
        status: 200,
        description: 'Returns the found CrowdActions and Pagination Information',
        type: PaginatedContactResponse,
    })
    async getAllContacts(@Query() pagination: PaginationDto, @Query('id') id: string): Promise<IPaginatedList<IContact>> {
        return this.cqrsHandler.fetch(ListContactsQuery, { ...pagination, filter: { id } });
    }

    @ApiOperation({ summary: 'Send user feedback' })
    async sendFormData(@Body() contactBody: ContactDto): Promise<Identifiable> {
        return await this.cqrsHandler.execute(SendFormCommand, { ...contactBody });
    }
}
