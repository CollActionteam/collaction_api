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
    ThreadSchema,
    ForumPermissionSchema,
    ForumPermissionPersistence,
} from '@infrastructure/mongo/persistence';
import {
    CommitmentRepository,
    CrowdActionRepository,
    ParticipationRepository,
    ProfileRepository,
    ContactRepository,
    ThreadRepository,
    ForumPermissionRepository,
    ForumRepository,
    PostRepsotory,
} from '@infrastructure/mongo/repository';
import { ICrowdActionRepository } from '@domain/crowdaction';
import { IProfileRepository } from '@domain/profile';
import { IParticipationRepository } from '@domain/participation';
import { IContactRepository } from '@domain/contact';
import { ICommitmentRepository } from '@domain/commitment';
import { IForumPermissionRepository, IForumRepository } from '@domain/forum';
import { IThreadRepository } from '@domain/thread';
import { IPostRepository } from '@domain/post';
import { ContactPersistence, ContactSchema } from './persistence/contact.persistence';
import { PostPersistence, PostSchema } from './persistence/post.persistence';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CrowdActionPersistence.name, schema: CrowdActionSchema },
            { name: ProfilePersistence.name, schema: ProfileSchema },
            { name: ParticipationPersistence.name, schema: ParticipationSchema },
            { name: CommitmentPersistence.name, schema: CommitmentSchema },
            { name: ContactPersistence.name, schema: ContactSchema },
            { name: ForumPersistence.name, schema: ForumSchema },
            { name: ThreadPersistence.name, schema: ThreadSchema },
            { name: ForumPermissionPersistence.name, schema: ForumPermissionSchema },
            { name: PostPersistence.name, schema: PostSchema },
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
        {
            provide: IThreadRepository,
            useClass: ThreadRepository,
        },
        {
            provide: IForumPermissionRepository,
            useClass: ForumPermissionRepository,
        },
        {
            provide: IPostRepository,
            useClass: PostRepsotory,
        },
    ],
    exports: [
        ICrowdActionRepository,
        IProfileRepository,
        IParticipationRepository,
        ICommitmentRepository,
        IContactRepository,
        IForumRepository,
        IThreadRepository,
        IForumPermissionRepository,
        IPostRepository,
    ],
})
export class MongoModule {}
