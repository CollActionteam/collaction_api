import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/auth/enum';

export class ThreadPrefixsDto {
    @ApiProperty({ name: 'id', type: String, required: true })
    readonly id: string;

    @ApiProperty({ name: 'prefix', type: String, required: true })
    readonly prefix: string;

    @ApiProperty({ name: 'forumIds', type: [String], isArray: true, required: true })
    readonly forumIds: [string];

    @ApiProperty({ name: 'roles', type: [UserRole], isArray: true, required: true })
    readonly roles: [UserRole];
}
