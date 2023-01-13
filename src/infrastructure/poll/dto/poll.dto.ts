import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PollStatusEnum } from '@domain/poll';

export class PollDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'threadId', type: String, required: true })
    readonly threadId: string;

    @ApiProperty({ name: 'question', type: String, required: true })
    readonly question: string;

    @ApiProperty({ name: 'options', type: [String], isArray: true, required: true })
    readonly options: [string];

    @ApiProperty({ name: 'voteCount', type: Number, required: true })
    readonly voteCount: number;

    @Type(() => Date)
    @ApiProperty({ name: 'endAt', type: Date, example: '2022-11-20T10:00:00.000Z', required: true })
    readonly endAt: Date;

    @ApiProperty({ name: 'status', type: PollStatusEnum, enum: PollStatusEnum, required: true })
    readonly status: PollStatusEnum;

    @ApiProperty({ name: 'multiple', type: Boolean, required: true })
    readonly multiple: boolean;
}
