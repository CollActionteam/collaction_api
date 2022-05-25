import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({ name: 'page', example: 1, required: false, default: 1 })
    readonly page: number;

    @ApiProperty({ name: 'pageSize', example: 15, required: false, default: 15 })
    readonly pageSize: number;
}
