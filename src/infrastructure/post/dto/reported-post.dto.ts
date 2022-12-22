import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReportStatusEnum } from '@domain/post';
import { UserInfoDto } from '@infrastructure/forum';

export class ReportedPostDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'postId', type: String, required: true })
    readonly postId: string;

    @ApiProperty({ name: 'threadId', type: String, required: true })
    readonly threadId: string;

    @ApiProperty({ name: 'forumId', type: String, required: true })
    readonly forumId: string;

    @ApiProperty({ name: 'author', type: UserInfoDto, required: true })
    readonly author: UserInfoDto;

    @ApiProperty({ name: 'reason', type: String, required: true })
    readonly reason: string;

    @ApiProperty({ name: 'handledById', type: String, required: false })
    readonly handledById?: string | undefined;

    @ApiProperty({ name: 'status', type: ReportStatusEnum, enum: ReportStatusEnum, required: true })
    readonly status: ReportStatusEnum;

    @Type(() => Date)
    @ApiProperty({ name: 'createdAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly createdAt: Date;

    @Type(() => Date)
    @ApiProperty({ name: 'updatedAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly updatedAt: Date;
}
