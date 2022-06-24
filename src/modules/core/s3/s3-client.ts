import S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IS3Client } from '@core/s3-client.interface';
import { FileTypeInvalidError } from '../errors';
import { UploadImageTypeEnum } from './enum';

const MIMETYPE_MAP = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};

@Injectable()
export class S3Client implements IS3Client {
    private readonly s3Client: S3;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3({
            region: this.configService.get('AWS_BUCKET_REGION'),
            accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
        });
    }

    async upload(file: any, id: string, type: UploadImageTypeEnum): Promise<string> {
        const directory = this.getDirectory(type);

        const extension: string | undefined = MIMETYPE_MAP[file.mimetype];

        if (!extension) {
            throw new FileTypeInvalidError(file.mimetype, Object.keys(MIMETYPE_MAP));
        }

        const uploadParams = {
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: directory + id + extension,
            ContentType: file.mimetype,
            Body: file.buffer,
            ACL: 'public-read',
            ETag: id,
        };

        return (await this.s3Client.upload(uploadParams).promise()).Key;
    }

    private getDirectory(type: UploadImageTypeEnum) {
        switch (type) {
            case UploadImageTypeEnum.CROWDACTION_BANNER:
                return 'crowdaction-banners/';
            case UploadImageTypeEnum.CROWDACTOIN_CARD:
                return 'crowdaction-cards/';
            case UploadImageTypeEnum.PROFILE:
                return 'profiles/';
            default:
                return 'others/';
        }
    }
}
