import { Inject, Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IS3Client } from '@core/s3-client.interface';
import { S3Client } from '@modules/core/s3';
import { UploadImageTypeEnum } from '@modules/core/s3/enum';
import { IProfileRepository } from '@domain/profile';

export interface UploadProfileImageCommandArgs {
    readonly file: any;
    readonly id: string;
    readonly type: UploadImageTypeEnum;
}

@Injectable()
export class UploadProfileImageCommand implements ICommand {
    constructor(@Inject(S3Client) private readonly s3Client: IS3Client, private readonly profileRepository: IProfileRepository) {}

    // TODO: Implement validations and errors
    async execute(args: UploadProfileImageCommandArgs): Promise<void> {
        const avatar = await this.s3Client.upload(args.file, args.id, UploadImageTypeEnum.PROFILE);
        const profile = await this.profileRepository.findOne({ userId: args.id });
        await this.profileRepository.patch(profile.id, { avatar });
    }
}
