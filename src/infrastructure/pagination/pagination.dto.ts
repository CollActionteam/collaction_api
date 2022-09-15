import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
    @Type(() => Number)
    @ApiProperty({ name: 'page', type: Number, example: 1, required: false, default: 1 })
    readonly page: number;

    @Type(() => Number)
    @ApiProperty({ name: 'pageSize', type: Number, example: 15, required: false, default: 15 })
    readonly pageSize: number;
}
