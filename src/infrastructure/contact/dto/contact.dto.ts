import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
    @ApiProperty({ name: 'title', required: true })
    readonly title: string;

    @ApiProperty({ name: 'body', required: true })
    readonly body: string;

    @ApiProperty({ name: 'email', required: true })
    readonly email: string;
}

export class PaginatedContactResponse {
    @ApiProperty({ type: [ContactDto] })
    readonly items: ContactDto[];

    @ApiProperty({ example: 1 })
    readonly page: number;

    @ApiProperty({ example: 10 })
    readonly pageSize: number;

    @ApiProperty({ example: 1 })
    readonly totalPages: number;

    @ApiProperty({ example: 1 })
    readonly totalItems: number;
}
