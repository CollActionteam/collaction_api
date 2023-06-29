import { Injectable } from '@nestjs/common';
import * as mime from 'mime';
import { IBlobClientRepository } from '@core/blob-client.interface';
import { FileTypeInvalidError } from '../errors';
import { UploadImageTypeEnum } from './enum';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

@Injectable()
export class BlobClientService {
    constructor(private readonly blobClient: IBlobClientRepository) {}

    async upload(file: any, id: string, type: UploadImageTypeEnum) {
        const directory = this.getDirectory(type);

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new FileTypeInvalidError(file.mimetype, ALLOWED_MIME_TYPES);
        }

        const extension = mime.getExtension(file.mimetype);
        const key = directory + id + '.' + extension;
        await this.blobClient.upload(file.buffer, key);
        return key;
    }

    private getDirectory(type: UploadImageTypeEnum) {
        switch (type) {
            case UploadImageTypeEnum.CROWDACTION_BANNER:
                return 'crowdaction-banners/';
            case UploadImageTypeEnum.CROWDACTION_CARD:
                return 'crowdaction-cards/';
            case UploadImageTypeEnum.PROFILE:
                return 'profiles/';
            default:
                return 'others/';
        }
    }
}
