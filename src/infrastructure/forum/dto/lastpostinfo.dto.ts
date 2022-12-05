import { ApiProperty } from '@nestjs/swagger';
import { PostInfoDto } from './postinfo.dto';
import { UserInfoDto } from './userinfo.dto';

export class LastPostInfoDto {
    @ApiProperty({ name: 'postInfo', type: PostInfoDto, required: true })
    readonly postInfo: PostInfoDto;

    @ApiProperty({ name: 'userInfo', type: UserInfoDto, required: true })
    readonly userInfo: UserInfoDto;
}
