import { ApiProperty } from '@nestjs/swagger';
import { PostInfoDto } from './post-info.dto';
import { UserInfoDto } from './user-info.dto';

export class LastPostInfoDto {
    @ApiProperty({ name: 'postInfo', type: PostInfoDto, required: true })
    readonly postInfo: PostInfoDto;

    @ApiProperty({ name: 'userInfo', type: UserInfoDto, required: true })
    readonly userInfo: UserInfoDto;
}
