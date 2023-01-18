import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    CommitmentOptionPersistence,
    CommitmentOptionSchema,
    CrowdActionPersistence,
    CrowdActionSchema,
    ParticipationPersistence,
    ParticipationSchema,
    ProfilePersistence,
    ProfileSchema,
    ForumPersistence,
    ForumPermissionPersistence,
    ForumSchema,
    ForumPermissionSchema,
    ThreadPersistence,
    ThreadPersistenceSchema,
} from '@infrastructure/mongo/persistence';
import {
    CommitmentOptionRepository,
    CrowdActionRepository,
    ParticipationRepository,
    ProfileRepository,
    ContactRepository,
    ForumRepository,
    ForumPermissionRepository,
    ThreadRepository,
} from '@infrastructure/mongo/repository';
import { ICrowdActionRepository } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { ICommitmentOptionRepository } from '@domain/commitmentoption';
import { IContactRepository } from '@domain/contact';
import { IForumPermissionRepository, IForumRepository } from '@domain/forum';
import { IThreadRepository } from '@domain/thread';
import { ContactPersistence, ContactSchema } from './persistence/contact.persistence';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CrowdActionPersistence.name, schema: CrowdActionSchema },
            { name: ProfilePersistence.name, schema: ProfileSchema },
            { name: ParticipationPersistence.name, schema: ParticipationSchema },
            { name: CommitmentOptionPersistence.name, schema: CommitmentOptionSchema },
            { name: ContactPersistence.name, schema: ContactSchema },
            { name: ForumPersistence.name, schema: ForumSchema },
            { name: ForumPermissionPersistence.name, schema: ForumPermissionSchema },
            { name: ThreadPersistence.name, schema: ThreadPersistenceSchema },
        ]),
    ],
    providers: [
        { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
        { provide: IProfileRepository, useClass: ProfileRepository },
        { provide: IParticipationRepository, useClass: ParticipationRepository },
        { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
        { provide: IContactRepository, useClass: ContactRepository },
        { provide: IForumRepository, useClass: ForumRepository },
        { provide: IForumPermissionRepository, useClass: ForumPermissionRepository },
        { provide: IThreadRepository, useClass: ThreadRepository },
    ],
    exports: [
        ICrowdActionRepository,
        IProfileRepository,
        IParticipationRepository,
        ICommitmentOptionRepository,
        IContactRepository,
        IForumRepository,
        IForumPermissionRepository,
        IThreadRepository,
    ],
})
export class MongoModule {}
