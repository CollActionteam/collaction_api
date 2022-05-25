import { Inject, Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IS3Client } from '@core/s3-client.interface';
import { S3Client } from '@modules/core/s3';
import { UploadImageTypeEnum } from '@modules/core/s3/enum';

export interface UploadProfileImageCommandArgs {
    readonly file: any;
    readonly id: string;
}

@Injectable()
export class UploadProfileImageCommand implements ICommand {
    constructor(@Inject(S3Client) private readonly s3Client: IS3Client) {}

    // TODO: Implement validations and errors
    async execute(args: UploadProfileImageCommandArgs): Promise<void> {
        await this.s3Client.upload(args.file, args.id, UploadImageTypeEnum.PROFILE);
    }
}
