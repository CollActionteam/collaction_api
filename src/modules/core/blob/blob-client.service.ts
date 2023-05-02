import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mime from 'mime';
import { IBlobClientRepository } from '@core/blob-client.interface';
import { FileTypeInvalidError } from '../errors';
import { UploadImageTypeEnum } from './enum';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

@Injectable()
export class BlobClientService {
    constructor(private readonly blobClient: IBlobClientRepository, private readonly configService: ConfigService) {}

    async upload(file: any, id: string, type: UploadImageTypeEnum) {
        const directory = this.getDirectory(type);

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new FileTypeInvalidError(file.mimetype, ALLOWED_MIME_TYPES);
        }

        const extension = mime.getExtension(file.mimetype);
        // TODO: Should all these params still be passed in like the previous implementation?
        const uploadParams = {
            Container: this.configService.get('AZURE_CONTAINER'),
            Key: directory + id + '.' + extension,
            ContentType: file.mimetype,
            Body: file.buffer,
            ACL: 'public-read',
            ETag: id,
        };
        await this.blobClient.upload(uploadParams, id);
        return uploadParams.Key;
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
