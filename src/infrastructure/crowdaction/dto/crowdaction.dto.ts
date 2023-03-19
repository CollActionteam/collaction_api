import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CrowdActionJoinStatusEnum, CrowdActionStatusEnum, ICrowdActionImages } from '@domain/crowdaction';
import { IBadge, Badge } from '@domain/badge';
import { CreateCommitmentDto } from '@infrastructure/commitment';
import { IBadgeConfig } from '@domain/crowdaction/interface/badge-config.interface';
import { BadgeConfig } from '@domain/crowdaction/entity/badge-config.entity';
import { ICommitment } from '@domain/commitment';
import { BadgeDto } from './badge.dto';

export class CrowdActionImagesDto implements ICrowdActionImages {
    @ApiProperty({ example: 'https://www.example.com/image.png' })
    readonly card: string;

    @ApiProperty({ example: 'https://www.example.com/image.png' })
    readonly banner: string;
}

export class CreateCrowdActionDto {
    @ApiProperty({ name: 'title', example: 'Veganuary', required: true })
    readonly title: string;

    @ApiProperty({ name: 'description', example: 'Improve your health, improve the world!', required: true })
    readonly description: string;

    @ApiProperty({ name: 'category', example: 'SUSTAINABILITY', required: true })
    readonly category: string;

    @ApiProperty({ name: 'subcategory', example: 'FOOD', required: false })
    readonly subcategory?: string;

    @ApiProperty({ name: 'country', example: 'NL', required: true })
    readonly country: string;

    @ApiProperty({ name: 'password', example: 'veganuary-2022', required: false })
    readonly password?: string;

    @Type(() => Date)
    @ApiProperty({ name: 'startAt', type: Date, example: '2023-12-22T15:00:00.000Z', required: true })
    readonly startAt: Date;

    @Type(() => Date)
    @ApiProperty({ name: 'endAt', type: Date, example: '2025-12-22T15:00:00.000Z', required: true })
    readonly endAt: Date;

    @Type(() => Date)
    @ApiProperty({ name: 'joinEndAt', type: Date, example: '2024-12-22T15:00:00.000Z', required: false })
    readonly joinEndAt?: Date;

    @ApiProperty({ name: 'badges', type: BadgeDto, isArray: true, required: false })
    readonly badges?: IBadge[];

    @ApiProperty({ name: 'commitments', isArray: true, type: CreateCommitmentDto })
    readonly commitments: ICommitment[];

    @ApiProperty({ name: 'badgeConfig', type: BadgeConfig, required: false })
    readonly diamondThreshold?: IBadgeConfig;
}

export class GetCrowdActionDto {
    @ApiProperty({ name: 'title', example: 'Veganuary', required: true })
    readonly title: string;

    @ApiProperty({ name: 'description', example: 'Improve your health, improve the world!', required: true })
    readonly description: string;

    @ApiProperty({ name: 'category', example: 'SUSTAINABILITY', required: true })
    readonly category: string;

    @ApiProperty({ name: 'subcategory', example: 'FOOD', required: false })
    readonly subcategory?: string;

    @ApiProperty({ name: 'commitments', isArray: true, type: CreateCommitmentDto })
    readonly commitments: ICommitment[];

    @ApiProperty({ name: 'country', example: 'NL', required: true })
    readonly country: string;

    @ApiProperty({ name: 'slug', example: 'veganuary', required: true })
    readonly slug: string;

    @ApiProperty({ name: 'password', example: 'veganuary-2022', required: false })
    readonly password?: string;

    @ApiProperty({ name: 'images', type: CrowdActionImagesDto, required: true })
    readonly images: ICrowdActionImages;

    @ApiProperty({ name: 'startAt', type: Date, example: '2023-12-22T15:00:00.000Z', required: true })
    readonly startAt: Date;

    @ApiProperty({ name: 'endAt', type: Date, example: '2025-12-22T15:00:00.000Z', required: true })
    readonly endAt: Date;

    @ApiProperty({ name: 'joinEndAt', type: Date, example: '2024-12-22T15:00:00.000Z', required: false })
    readonly joinEndAt?: Date;

    @ApiProperty({ name: 'badges', type: [Badge], isArray: true, required: false })
    readonly badges?: Badge[];
}

export class PaginatedCrowdActionResponse {
    @ApiProperty({ type: [GetCrowdActionDto] })
    readonly items: GetCrowdActionDto[];

    @ApiProperty({ example: 1 })
    readonly page: number;

    @ApiProperty({ example: 10 })
    readonly pageSize: number;

    @ApiProperty({ example: 1 })
    readonly totalPages: number;

    @ApiProperty({ example: 1 })
    readonly totalItems: number;
}

export class FilterCrowdActionDto {
    @ApiProperty({ name: 'id', required: false })
    readonly id?: string;

    @ApiProperty({ name: 'status', enum: CrowdActionStatusEnum, required: false })
    readonly status?: CrowdActionStatusEnum;

    @ApiProperty({ name: 'joinStatus', enum: CrowdActionJoinStatusEnum, required: false })
    readonly joinStatus?: CrowdActionJoinStatusEnum;

    @ApiProperty({ name: 'category', required: false })
    readonly category?: string;

    @ApiProperty({ name: 'subcategory', required: false })
    readonly subcategory?: string;

    @ApiProperty({ name: 'startAt', type: Date, required: false })
    readonly startAt?: Date;

    @ApiProperty({ name: 'endAt', type: Date, required: false })
    readonly endAt?: Date;

    @ApiProperty({ name: 'joinEndAt', type: Date, required: false })
    readonly joinEndAt?: Date;

    @ApiProperty({ name: 'slug', required: false })
    readonly slug?: string;
}
