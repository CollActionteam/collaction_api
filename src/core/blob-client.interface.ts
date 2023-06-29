import { BlockBlobUploadResponse } from '@azure/storage-blob';

export abstract class IBlobClientRepository {
    abstract upload(params: any, imageName: string): Promise<BlockBlobUploadResponse>;
}
