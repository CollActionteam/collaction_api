export interface Identifiable {
    readonly id: string;
}

export interface IPageInfo {
    readonly totalPages: number;
    readonly totalItems: number;
    readonly page: number;
    readonly pageSize: number;
}

export interface IPaginatedList<T> {
    readonly items: T[];
    readonly pageInfo: IPageInfo;
}
