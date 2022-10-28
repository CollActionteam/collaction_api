export interface IS3ClientRepository {
    upload(params: any): Promise<string>;
}
