import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserInfoDto } from '@infrastructure/forum';

export class PostDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'threadId', type: String, required: true })
    readonly threadId: string;

    @ApiProperty({ name: 'forumId', type: String, required: true })
    readonly forumId: string;

    @ApiProperty({ name: 'subject', type: String, required: true })
    readonly subject: string;

    @ApiProperty({ name: 'author', type: UserInfoDto, required: true })
    readonly author: UserInfoDto;

    @ApiProperty({ name: 'message', type: String, required: true })
    readonly message: string;

    @ApiProperty({ name: 'visible', type: Boolean, required: true })
    readonly visible: boolean;

    @Type(() => Date)
    @ApiProperty({ name: 'createdAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly createdAt: Date;

    @Type(() => Date)
    @ApiProperty({ name: 'updatedAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly updatedAt: Date;
}
