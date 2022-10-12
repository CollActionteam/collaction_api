import S3 from 'aws-sdk/clients/s3';
import { Injectable } from '@nestjs/common';
import { IS3ClientRepository } from '@core/s3-client.interface';

@Injectable()
export class S3ClientRepository implements IS3ClientRepository {
    private readonly s3Client: S3;

    async upload(params: any): Promise<string> {
        return (await this.s3Client.upload(params).promise()).Key;
    }
}