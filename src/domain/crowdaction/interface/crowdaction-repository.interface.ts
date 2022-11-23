import { FindCriteria, IRepository } from '@core/repository.interface';
import { CrowdAction, ICrowdAction } from '@domain/crowdaction';

export type CreateCrowdAction = Omit<ICrowdAction, 'id' | 'createdAt' | 'updatedAt'>;
export type PatchCrowdAction = Partial<ICrowdAction>;
export type QueryCrowdAction = Partial<Pick<ICrowdAction, 'id' | 'status' | 'joinStatus' | 'category' | 'subcategory' | 'endAt' | 'slug'>>;

export abstract class ICrowdActionRepository implements IRepository<CrowdAction, CreateCrowdAction, PatchCrowdAction, QueryCrowdAction> {
    abstract create(entityLike: CreateCrowdAction): Promise<CrowdAction>;
    abstract patch(id: string, entityLike: PatchCrowdAction): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findOne(query: FindCriteria<QueryCrowdAction>): Promise<CrowdAction>;
    abstract findAll(query: FindCriteria<QueryCrowdAction>): Promise<CrowdAction[]>;
    abstract increment(query: FindCriteria<QueryCrowdAction>, field: string, value?: number): Promise<void>;
    abstract count(query: FindCriteria<QueryCrowdAction>): Promise<number>;
}
