import { UploadImageTypeEnum } from '@modules/core/s3/enum';

export interface IS3Client {
    upload(file: any, id: string, type: UploadImageTypeEnum): Promise<string>;
}
