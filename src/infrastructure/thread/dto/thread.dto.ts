import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LastPostInfoDto, UserInfoDto } from '@infrastructure/forum';

export class ThreadDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'prefixId', type: String, required: true })
    readonly prefixId: string;

    @ApiProperty({ name: 'forumId', type: String, required: true })
    readonly forumId: string;

    @ApiProperty({ name: 'firstPost', type: String, required: true })
    readonly firstPost: string;

    @ApiProperty({ name: 'pollId', type: String, required: false })
    readonly pollId?: string | undefined;

    @ApiProperty({ name: 'subject', type: String, required: true })
    readonly subject: string;

    @ApiProperty({ name: 'message', type: String, required: true })
    readonly message: string;

    @ApiProperty({ name: 'author', type: UserInfoDto, required: true })
    readonly author: UserInfoDto;

    @ApiProperty({ name: 'closed', type: Boolean, required: true })
    readonly closed: boolean;

    @ApiProperty({ name: 'stickied', type: Boolean, required: true })
    readonly stickied: boolean;

    @ApiProperty({ name: 'visible', type: Boolean, required: true })
    readonly visible: boolean;

    @ApiProperty({ name: 'number', type: Number, required: true })
    readonly replyCount: number;

    @ApiProperty({ name: 'lastPostInfo', type: LastPostInfoDto, required: true })
    readonly lastPostInfo: LastPostInfoDto;

    @Type(() => Date)
    @ApiProperty({ name: 'createdAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly createdAt: Date;

    @Type(() => Date)
    @ApiProperty({ name: 'updatedAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly updatedAt: Date;
}
