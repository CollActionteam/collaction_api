import S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import mime from 'mime';
import { IS3Client } from '@core/s3-client.interface';
import { UploadImageTypeEnum } from './enum';

const MIME = mime;

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

    async upload(file: any, id: string, type: UploadImageTypeEnum): Promise<void> {
        const directory = this.getDirectory(type);

        const imageType = MIME.extension(file.mimetype);
        const uploadParams = {
            Bucket: this.configService.get('AWS_BUCKET_NAME'),
            Key: directory + id + '.' + imageType,
            ContentType: file.mimetype,
            Body: file.buffer,
            ACL: 'public-read',
            ETag: id,
        };

        this.s3Client.upload(uploadParams).promise();
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
