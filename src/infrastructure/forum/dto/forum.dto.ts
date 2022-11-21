import { ApiProperty } from '@nestjs/swagger';
import { ForumTypeEnum } from '@domain/forum/enum/forum.enum';
import { LastPostInfoDto } from './lastpostinfo.dto';

export class ForumDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'type', type: ForumTypeEnum, enum: ForumTypeEnum, required: true })
    readonly type: ForumTypeEnum;

    @ApiProperty({ name: 'icon', type: String, required: true })
    readonly icon: string;

    @ApiProperty({ name: 'name', type: String, required: true })
    name: string;

    @ApiProperty({ name: 'description', type: String, required: true })
    description: string;

    @ApiProperty({ name: 'parentId', type: String, required: false })
    parentId?: string | undefined;

    @ApiProperty({ name: 'parentList', type: [String], isArray: true, required: false })
    parentList?: [string] | undefined;

    @ApiProperty({ name: 'displayOrder', type: Number, required: true })
    displayOrder: number;

    @ApiProperty({ name: 'threadCount', type: Number, required: true })
    threadCount: number;

    @ApiProperty({ name: 'postCount', type: Number, required: true })
    postCount: number;

    @ApiProperty({ name: 'visible', type: Boolean, required: true })
    visible: boolean;

    @ApiProperty({ name: 'lastPostInfo', type: LastPostInfoDto, required: false })
    lastPostInfo: LastPostInfoDto | undefined;
}
