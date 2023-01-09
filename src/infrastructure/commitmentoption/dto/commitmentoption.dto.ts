import { ApiProperty } from '@nestjs/swagger';

export class CreateCommitmentOptionDto {
    @ApiProperty({ name: 'type', required: true })
    readonly type: string;

    @ApiProperty({ name: 'label', required: true })
    readonly label: string;

    @ApiProperty({ name: 'description', type: String, required: false })
    readonly description?: string | undefined;

    @ApiProperty({ name: 'points', type: Number, required: true })
    readonly points: number;

    @ApiProperty({
        name: 'blocks',
        description: 'ID of CommitmentOptions that are blocked if this one is selected',
        required: false,
        type: [String],
        isArray: true,
    })
    readonly blocks?: string[];

    @ApiProperty({ name: 'icon', required: true })
    readonly icon: string;
}

export class UpdateCommitmentOptionDto {
    @ApiProperty({ name: 'type', required: true })
    readonly type: string;

    @ApiProperty({ name: 'label', required: false })
    readonly label?: string;

    @ApiProperty({ name: 'description', type: String, required: false })
    readonly description?: string;

    @ApiProperty({ name: 'points', type: Number, required: false })
    readonly points?: number;

    @ApiProperty({
        name: 'blocks',
        description: 'ID of CommitmentOptions that are blocked if this one is selected',
        required: false,
        type: [String],
        isArray: true,
    })
    readonly blocks?: string[];

    @ApiProperty({ name: 'icon', required: true })
    readonly icon: string;
}
