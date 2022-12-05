import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
    @ApiProperty({ name: 'userId', type: String, required: true })
    readonly userId: string;

    @ApiProperty({ name: 'fullName', type: String, required: true })
    readonly fullName: string;

    @ApiProperty({ name: 'avatar', type: String, required: true })
    readonly avatar: string;

    @ApiProperty({ name: 'threadCount', type: Number, required: true })
    readonly threadCount: number;

    @ApiProperty({ name: 'postCount', type: Number, required: true })
    readonly postCount: number;
}
