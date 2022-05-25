import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    CrowdActionPersistence,
    CrowdActionSchema,
    ParticipationPersistence,
    ParticipationSchema,
    ProfilePersistence,
    ProfileSchema,
} from '@infrastructure/mongo/persistence';
import { CrowdActionRepository, ParticipationRepository, ProfileRepository } from '@infrastructure/mongo/repository';
import { ICrowdActionRepository } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CrowdActionPersistence.name, schema: CrowdActionSchema },
            { name: ProfilePersistence.name, schema: ProfileSchema },
            { name: ParticipationPersistence.name, schema: ParticipationSchema },
        ]),
    ],
    providers: [
        {
            provide: ICrowdActionRepository,
            useClass: CrowdActionRepository,
        },
        {
            provide: IProfileRepository,
            useClass: ProfileRepository,
        },
        {
            provide: IParticipationRepository,
            useClass: ParticipationRepository,
        },
    ],
    exports: [ICrowdActionRepository, IProfileRepository, IParticipationRepository],
})
export class MongoModule {}
