import { ApiProperty } from '@nestjs/swagger';
import { ForumTypeEnum } from '@domain/forum/enum/forum.enum';
import { LastPostInfoDto } from './last-post-info.dto';

export class ForumDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'type', type: ForumTypeEnum, enum: ForumTypeEnum, required: true })
    readonly type: ForumTypeEnum;

    @ApiProperty({ name: 'icon', type: String, required: true })
    readonly icon: string;

    @ApiProperty({ name: 'name', type: String, required: true })
    readonly name: string;

    @ApiProperty({ name: 'description', type: String, required: true })
    readonly description: string;

    @ApiProperty({ name: 'parentId', type: String, required: false })
    readonly parentId?: string | undefined;

    @ApiProperty({ name: 'parentList', type: [String], isArray: true, required: false })
    readonly parentList?: string[] | undefined;

    @ApiProperty({ name: 'displayOrder', type: Number, required: true })
    readonly displayOrder: number;

    @ApiProperty({ name: 'threadCount', type: Number, required: true })
    readonly threadCount: number;

    @ApiProperty({ name: 'postCount', type: Number, required: true })
    readonly postCount: number;

    @ApiProperty({ name: 'visible', type: Boolean, required: true })
    readonly visible: boolean;

    @ApiProperty({ name: 'lastPostInfo', type: LastPostInfoDto, required: false })
    readonly lastPostInfo: LastPostInfoDto | undefined;
}

export class CreateForumDto {
    @ApiProperty({ name: 'type', type: ForumTypeEnum, enum: ForumTypeEnum, required: true })
    readonly type: ForumTypeEnum;

    @ApiProperty({ name: 'icon', type: String, required: true })
    readonly icon: string;

    @ApiProperty({ name: 'name', type: String, required: true })
    readonly name: string;

    @ApiProperty({ name: 'description', type: String, required: true })
    readonly description: string;

    @ApiProperty({ name: 'parentId', type: String, required: false })
    readonly parentId?: string | undefined;
}
