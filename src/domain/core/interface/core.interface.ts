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

export interface IPostInfo {
    readonly postId: string;
    readonly title: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface IUserInfo {
    readonly userId: string;
    readonly fullName: string;
    readonly avatar?: string;
    readonly threadCount: number;
    readonly postCount: number;
}

export interface ILastPostInfo {
    readonly postInfo: IPostInfo;
    readonly userInfo: IUserInfo;
}
