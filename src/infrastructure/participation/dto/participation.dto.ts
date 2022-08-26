import { ApiProperty } from '@nestjs/swagger';
import { IParticipation } from '@domain/participation';

export class ParticipationDto implements Omit<IParticipation, 'id' | 'joinDate' | 'dailyCheckIns'> {
    @ApiProperty({ name: 'crowdActionId', example: '628a51e92b3586be2ee1dbfc', required: true })
    readonly crowdActionId: string;

    @ApiProperty({ name: 'userId', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: true })
    readonly userId: string;

    @ApiProperty({ name: 'fullName', required: true })
    readonly fullName: string;

    @ApiProperty({ name: 'avatar', required: false })
    readonly avatar?: string | undefined;

    @ApiProperty({
        name: 'commitmentOptions',
        type: [String],
        isArray: true,
        required: true,
    })
    readonly commitmentOptions: string[];
}

export class ToggleParticipationDto {
    @ApiProperty({ name: 'crowdActionId', example: '628a51e92b3586be2ee1dbfc', required: true })
    readonly crowdActionId: string;

    @ApiProperty({
        name: 'commitmentOptions',
        type: [String],
        isArray: true,
        required: false,
    })
    readonly commitmentOptions?: string[];
}

export class ToggleParticipationResponse {
    @ApiProperty({ name: 'isParticipating', example: true, required: true })
    readonly isParticipating: boolean;

    @ApiProperty({ name: 'participationId', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', required: false })
    readonly participationId?: string;
}

export class PaginatedParticipationResponse {
    @ApiProperty({ type: [ParticipationDto] })
    readonly items: ParticipationDto[];

    @ApiProperty({ example: 1 })
    readonly page: number;

    @ApiProperty({ example: 10 })
    readonly pageSize: number;

    @ApiProperty({ example: 1 })
    readonly totalPages: number;

    @ApiProperty({ example: 1 })
    readonly totalItems: number;
}
