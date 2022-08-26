import { ApiProperty } from '@nestjs/swagger';
import { CrowdActionTypeEnum } from '@domain/crowdaction';
import { CommitmentOptionIconEnum } from '@domain/commitmentoption/enum/commitmentoption.enum';

export class CreateCommitmentOptionDto {
    @ApiProperty({ name: 'type', type: CrowdActionTypeEnum, enum: CrowdActionTypeEnum, required: true })
    readonly type: CrowdActionTypeEnum;

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

    @ApiProperty({ name: 'icon', type: CommitmentOptionIconEnum, enum: CommitmentOptionIconEnum, required: true })
    readonly icon: CommitmentOptionIconEnum;
}

export class UpdateCommitmentOptionDto {
    @ApiProperty({ name: 'type', type: CrowdActionTypeEnum, enum: CrowdActionTypeEnum, required: true })
    readonly type: CrowdActionTypeEnum;

    @ApiProperty({ name: 'label', required: false })
    readonly label?: string;

    @ApiProperty({ name: 'description', required: false })
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

    @ApiProperty({ name: 'icon', type: CommitmentOptionIconEnum, enum: CommitmentOptionIconEnum, required: true })
    readonly icon: CommitmentOptionIconEnum;
}
