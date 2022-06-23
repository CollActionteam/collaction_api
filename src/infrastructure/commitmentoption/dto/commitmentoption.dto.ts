import { ApiProperty } from '@nestjs/swagger';
import { CrowdActionCategoryEnum } from '@domain/crowdaction';

export class CreateCommitmentOptionDto {
    @ApiProperty({ name: 'category', type: CrowdActionCategoryEnum, enum: CrowdActionCategoryEnum, required: true })
    readonly category: CrowdActionCategoryEnum;

    @ApiProperty({ name: 'label', required: true })
    readonly label: string;

    @ApiProperty({ name: 'description', required: true })
    readonly description: string;

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
}
