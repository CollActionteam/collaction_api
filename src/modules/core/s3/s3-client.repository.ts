import S3 from 'aws-sdk/clients/s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IS3ClientRepository } from '@core/s3-client.interface';

@Injectable()
export class S3ClientRepository implements IS3ClientRepository {
    private readonly s3Client: S3;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3({
            region: this.configService.get('AWS_BUCKET_REGION'),
            accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
        });
    }

    async upload(params: any): Promise<string> {
        return (await this.s3Client.upload(params).promise()).Key;
    }
}
