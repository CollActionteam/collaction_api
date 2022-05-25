import { ApiProperty } from '@nestjs/swagger';
import { CommitmentOptionEnum, CrowdActionCategoryEnum, CrowdActionTypeEnum, ICrowdActionImages } from '@domain/crowdaction';

export class CrowdActionImagesDto implements ICrowdActionImages {
    @ApiProperty({ example: 'https://www.example.com/image.png' })
    readonly card: string;

    @ApiProperty({ example: 'https://www.example.com/image.png' })
    readonly banner: string;
}

export class CrowdActionDto {
    @ApiProperty({ name: 'type', enum: CrowdActionTypeEnum, required: true })
    readonly type: CrowdActionTypeEnum;

    @ApiProperty({ name: 'title', example: 'Veganuary', required: true })
    readonly title: string;

    @ApiProperty({ name: 'description', example: 'Improve your health, improve the world!', required: true })
    readonly description: string;

    @ApiProperty({ name: 'category', enum: CrowdActionCategoryEnum, required: true })
    readonly category: CrowdActionCategoryEnum;

    @ApiProperty({ name: 'subcategory', enum: CrowdActionCategoryEnum, example: CrowdActionCategoryEnum.FOOD, required: false })
    readonly subcategory?: CrowdActionCategoryEnum;

    @ApiProperty({ name: 'country', example: 'NL', required: true })
    readonly country: string;

    @ApiProperty({ name: 'password', example: 'veganuary-2022', required: false })
    readonly password?: string;

    @ApiProperty({ name: 'images', type: CrowdActionImagesDto, required: true })
    readonly images: ICrowdActionImages;

    @ApiProperty({
        name: 'commitmentOptions',
        type: [CommitmentOptionEnum],
        enum: CommitmentOptionEnum,
        isArray: true,
        example: [CommitmentOptionEnum.DAIRY_FREE, CommitmentOptionEnum.NO_BEEF, CommitmentOptionEnum.PESCETARIAN],
        required: true,
    })
    readonly commitmentOptions: CommitmentOptionEnum[];

    @ApiProperty({ name: 'startAt', type: Date, example: '2022-12-22T15:00:00.000Z', required: true })
    readonly startAt: Date;

    @ApiProperty({ name: 'endAt', type: Date, example: '2024-12-22T15:00:00.000Z', required: true })
    readonly endAt: Date;

    @ApiProperty({ name: 'joinEndAt', type: Date, example: '2023-12-22T15:00:00.000Z', required: false })
    readonly joinEndAt?: Date;
}

export class PaginatedCrowdActionResponse {
    @ApiProperty({ type: [CrowdActionDto] })
    readonly items: CrowdActionDto[];

    @ApiProperty({ example: 1 })
    readonly page: number;

    @ApiProperty({ example: 10 })
    readonly pageSize: number;

    @ApiProperty({ example: 1 })
    readonly totalPages: number;

    @ApiProperty({ example: 1 })
    readonly totalItems: number;
}
