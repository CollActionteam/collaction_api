import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as mime from 'mime';
import { IS3ClientRepository } from '@core/s3-client.interface';
import { FileTypeInvalidError } from '../errors';
import { UploadImageTypeEnum } from './enum';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

@Injectable()
export class S3ClientService {

    constructor(private readonly s3Client: IS3ClientRepository, private readonly configService: ConfigService) {}

    async upload(file: any, id: string, type: UploadImageTypeEnum): Promise<string> {
        const directory = this.getDirectory(type);

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new FileTypeInvalidError(file.mimetype, ALLOWED_MIME_TYPES);
        }

        const extension = mime.getExtension(file.mimetype);
        const uploadParams = {
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: directory + id + '.' + extension,
            ContentType: file.mimetype,
            Body: file.buffer,
            ACL: 'public-read',
            ETag: id,
        };

        return await this.s3Client.upload(uploadParams);
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
