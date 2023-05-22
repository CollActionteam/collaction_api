import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { ICommitment } from '@domain/commitment';

export class CreateCommitmentDto {
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

    @ApiProperty({ name: 'icon', required: true })
    readonly icon: string;
}

export class GetCommitmentDto {
    @ApiProperty({ name: 'id', required: true, default: uuidv4() })
    readonly id: string;

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
        type: String,
        isArray: true,
    })
    readonly blocks?: string[];

    @ApiProperty({ name: 'icon', required: true })
    readonly icon: string;
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

    @ApiProperty({ name: 'icon', required: true })
    readonly icon: string;
}

export class CrowdActionCommitmentDto implements Omit<ICommitment, 'id' | 'createdAt' | 'updatedAt'> {
    @ApiProperty({ name: 'label', example: 'Vegan' })
    readonly label: string;

    @ApiProperty({ name: 'description', example: 'Commit to eating no product or by-product from animals ', required: false })
    readonly description?: string | undefined;

    @ApiProperty({ name: 'icon', example: 'magnet_outline' })
    readonly icon: string;

    @ApiProperty({ name: 'tags', example: ['food', 'energy'], isArray: true, type: [String] })
    readonly tags: string[];

    @ApiProperty({ name: 'points', example: 20 })
    readonly points: number;

    @ApiProperty({ name: 'blocks', required: false })
    readonly blocks?: string[] | undefined;
}
export class PaginatedCommitmentResponse {
    @ApiProperty({ type: [GetCommitmentDto] })
    readonly items: GetCommitmentDto[];

    @ApiProperty({ example: 1 })
    readonly page: number;

    @ApiProperty({ example: 10 })
    readonly pageSize: number;

    @ApiProperty({ example: 1 })
    readonly totalPages: number;

    @ApiProperty({ example: 1 })
    readonly totalItems: number;
}
