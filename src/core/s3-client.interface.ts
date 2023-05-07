export abstract class IS3ClientRepository {
    abstract upload(params: any): Promise<string>;
}
