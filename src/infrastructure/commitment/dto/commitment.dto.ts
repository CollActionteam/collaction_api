import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { CommitmentIconEnum } from '@domain/commitment/enum/commitment.enum';

export class CreateCommitmentDto {
    @ApiProperty({ name: '_id', required: true, default: uuidv4() })
    readonly _id: string;

    @ApiProperty({ name: 'tags', isArray: true, required: true })
    readonly tags: string[];

    @ApiProperty({ name: 'label', required: true })
    readonly label: string;

    @ApiProperty({ name: 'description', type: String, required: false })
    readonly description?: string | undefined;

    @ApiProperty({ name: 'points', type: Number, required: true })
    readonly points: number;

    @ApiProperty({
        name: 'blocks',
        description: 'ID of Commitments that are blocked if this one is selected',
        required: false,
        type: [String],
        isArray: true,
    })
    readonly blocks?: string[];

    @ApiProperty({ name: 'icon', type: CommitmentIconEnum, enum: CommitmentIconEnum, required: true })
    readonly icon: CommitmentIconEnum;
}

export class UpdateCommitmentDto {
    @ApiProperty({ name: 'tags', isArray: true, required: true })
    readonly tags: string[];

    @ApiProperty({ name: 'label', required: false })
    readonly label?: string;

    @ApiProperty({ name: 'description', type: String, required: false })
    readonly description?: string;

    @ApiProperty({ name: 'points', type: Number, required: false })
    readonly points?: number;

    @ApiProperty({
        name: 'blocks',
        description: 'ID of Commitments that are blocked if this one is selected',
        required: false,
        type: [String],
        isArray: true,
    })
    readonly blocks?: string[];

    @ApiProperty({ name: 'icon', type: CommitmentIconEnum, enum: CommitmentIconEnum, required: true })
    readonly icon: CommitmentIconEnum;
}
