import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostInfoDto {
    @ApiProperty({ name: 'postId', type: String, required: true })
    readonly postId: string;

    @ApiProperty({ name: 'title', type: String, required: true })
    readonly title: string;

    @Type(() => Date)
    @ApiProperty({ name: 'createdAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly createdAt: Date;

    @Type(() => Date)
    @ApiProperty({ name: 'updatedAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly updatedAt: Date;
}
