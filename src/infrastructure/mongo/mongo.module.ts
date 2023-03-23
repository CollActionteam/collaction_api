import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    CommitmentPersistence,
    CommitmentSchema,
    CrowdActionPersistence,
    CrowdActionSchema,
    ParticipationPersistence,
    ParticipationSchema,
    ProfilePersistence,
    ProfileSchema,
    ForumPersistence,
    ForumSchema,
    ThreadPersistence,
    ThreadPersistenceSchema,
} from '@infrastructure/mongo/persistence';
import {
    CommitmentRepository,
    CrowdActionRepository,
    ParticipationRepository,
    ProfileRepository,
    ContactRepository,
} from '@infrastructure/mongo/repository';
import { ICrowdActionRepository } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { IContactRepository } from '@domain/contact';
import { ICommitmentRepository } from '@domain/commitment';
import { IForumRepository } from '@domain/forum';
import { ContactPersistence, ContactSchema } from './persistence/contact.persistence';
import { ForumRepository } from './repository/forum.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CrowdActionPersistence.name, schema: CrowdActionSchema },
            { name: ProfilePersistence.name, schema: ProfileSchema },
            { name: ParticipationPersistence.name, schema: ParticipationSchema },
            { name: CommitmentPersistence.name, schema: CommitmentSchema },
            { name: ContactPersistence.name, schema: ContactSchema },
            { name: ForumPersistence.name, schema: ForumSchema },
            { name: ThreadPersistence.name, schema: ThreadPersistenceSchema },
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
        {
            provide: ICommitmentRepository,
            useClass: CommitmentRepository,
        },
        {
            provide: IContactRepository,
            useClass: ContactRepository,
        },
        {
            provide: IForumRepository,
            useClass: ForumRepository,
        },
    ],
    exports: [
        ICrowdActionRepository,
        IProfileRepository,
        IParticipationRepository,
        ICommitmentRepository,
        IContactRepository,
        IForumRepository,
    ],
})
export class MongoModule {}
