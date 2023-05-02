import { BlobServiceClient, BlockBlobUploadResponse, ContainerClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBlobClientRepository } from '@core/blob-client.interface';

@Injectable()
export class BlobClientRepository implements IBlobClientRepository {
    private readonly containerClient: ContainerClient;

    constructor(private readonly configService: ConfigService) {
        const azureConnection = this.configService.get('AZURE_CONNECTION');
        const azureContainer = this.configService.get('AZURE_CONTAINER');
        const blobServiceClient = BlobServiceClient.fromConnectionString(azureConnection);
        this.containerClient = blobServiceClient.getContainerClient(azureContainer);
    }

    async upload(params: any, imageName: string): Promise<BlockBlobUploadResponse> {
        // TODO: I pass id as the imageName. I presume that should be ok for the name of the file
        const blobClient = this.containerClient.getBlockBlobClient(imageName);
        return await blobClient.upload(params, params.length);
    }
}
