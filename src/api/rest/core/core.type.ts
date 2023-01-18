import { ApiProperty } from '@nestjs/swagger';

export class IdentifiableResponse {
    @ApiProperty({ name: 'id', example: '6288d335fcb7de400948ee48' })
    readonly id: string;
}
