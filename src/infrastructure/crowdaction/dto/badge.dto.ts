import { ApiProperty } from '@nestjs/swagger';
import { AwardTypeEnum, BadgeTierEnum, IBadge } from '@domain/badge';

export class BadgeDto implements IBadge {
    @ApiProperty({ name: 'tier', enum: BadgeTierEnum, example: BadgeTierEnum.DIAMOND, required: true })
    readonly tier: BadgeTierEnum;

    @ApiProperty({ name: 'awardType', enum: AwardTypeEnum, example: AwardTypeEnum.TIER, required: true })
    readonly awardType: AwardTypeEnum;

    @ApiProperty({ name: 'minimumCheckIns', example: 0, required: true })
    readonly minimumCheckIns: number;
}
