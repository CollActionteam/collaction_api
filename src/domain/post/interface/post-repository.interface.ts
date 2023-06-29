import { FindCriteria, IRepository } from '@core/repository.interface';
import { Post } from '../entity';
import { IPost } from './post.interface';

export type CreatePost = Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>;
export type PatchPost = Partial<IPost>;
export type QueryPost = Partial<Pick<IPost, 'id' | 'threadId'>>;

export abstract class IPostRepository implements IRepository<Post, CreatePost, PatchPost, QueryPost> {
    abstract findAll(query: FindCriteria<QueryPost>): Promise<Post[]>;
    abstract create(entityLike: CreatePost): Promise<Post>;
    abstract patch(id: string, entityLike: PatchPost): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryPost>): Promise<Post>;
}
