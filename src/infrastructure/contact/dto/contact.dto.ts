import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
    @ApiProperty({ name: 'title', required: true })
    readonly title: string;

    @ApiProperty({ name: 'body', required: true })
    readonly body: string;

    @ApiProperty({ name: 'email', required: true })
    readonly email: string;
}
