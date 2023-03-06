import { ApiProperty } from '@nestjs/swagger';
import { AwardTypeEnum, BadgeTierEnum, IBadge, ICrowdActionMetadata } from '@domain/badge';
export class CrowdActionMetadataDTO implements ICrowdActionMetadata {
    @ApiProperty({ name: 'id', example: '123', required: true })
    readonly id: string;

    @ApiProperty({ name: 'title', example: 'Veganuary', required: true })
    readonly title: string;
}

export class BadgeDto implements IBadge {
    @ApiProperty({ name: 'tier', enum: BadgeTierEnum, example: BadgeTierEnum.DIAMOND, required: true })
    readonly tier: BadgeTierEnum;

    @ApiProperty({ name: 'awardType', enum: AwardTypeEnum, example: AwardTypeEnum.TIER, required: true })
    readonly awardType: AwardTypeEnum;

    @ApiProperty({ name: 'minimumCheckIns', example: 0, required: true })
    readonly minimumCheckIns: number;

    @ApiProperty({ name: 'accessibilityOutline', example: 'https://www.example.com/badge_image.png', required: false })
    readonly accessibilityOutline: string;

    @ApiProperty({ name: 'usedByCrowdActions', type: [CrowdActionMetadataDTO], isArray: true, required: false })
    readonly usedByCrowdActions: CrowdActionMetadataDTO[];
}
