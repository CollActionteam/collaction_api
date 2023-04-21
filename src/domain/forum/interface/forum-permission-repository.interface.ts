import { FindCriteria, FindOptions, FindQuery, IRepository } from '@core/repository.interface';
import { ForumPermission } from '../entity';
import { IForumPermission } from './forum-permission.interface';

export type CreateForumPermission = Omit<ForumPermission, 'id'>;
export type PatchForumPermission = Partial<IForumPermission>;
export type QueryForumPermission = FindQuery<Partial<Pick<IForumPermission, 'id' | 'forumId' | 'role'>>>;

export abstract class IForumPermissionRepository
    implements IRepository<ForumPermission, CreateForumPermission, PatchForumPermission, QueryForumPermission>
{
    abstract create(entityLike: CreateForumPermission): Promise<ForumPermission>;
    abstract patch(id: string, entityLike: PatchForumPermission): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryForumPermission>): Promise<ForumPermission>;
    abstract findAll<TSort>(
        query: FindCriteria<QueryForumPermission>,
        options?: FindOptions<TSort> | undefined,
    ): Promise<ForumPermission[]>;
    abstract count(criteria: FindCriteria<QueryForumPermission>): Promise<number>;
}
