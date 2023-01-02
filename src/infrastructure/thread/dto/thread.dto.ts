import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
    readonly userId: string;

    @ApiProperty({ name: 'forumId', type: String, example: '63ab19666a4f8c5fc3c9ac78', required: true })
    readonly forumId: string;

    @ApiProperty({ name: 'prefixId', type: String, example: '63ab19706a4f8c5fc3c9ac79', required: false })
    readonly prefixId: string;

    @ApiProperty({ name: 'subject', type: String, example: 'New thread', required: true })
    readonly subject: string;

    @ApiProperty({ name: 'message', type: String, example: 'Sit eiusmod dolore adipisicing enim commodo cupidatat minim.', required: true })
    readonly message: string;
}
