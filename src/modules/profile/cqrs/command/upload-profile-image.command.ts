import { Inject, Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { UploadImageTypeEnum } from '@modules/core/s3/enum';
import { IProfileRepository } from '@domain/profile';
import { BlobClientService } from '@modules/core';

export interface UploadProfileImageCommandArgs {
    readonly file: any;
    readonly id: string;
    readonly type: UploadImageTypeEnum;
}

@Injectable()
export class UploadProfileImageCommand implements ICommand {
    constructor(
        @Inject(BlobClientService) private readonly blobClientService: BlobClientService,
        private readonly profileRepository: IProfileRepository,
    ) {}

    // TODO: Implement validations and errors
    async execute(args: UploadProfileImageCommandArgs): Promise<void> {
        const avatar = await this.blobClientService.upload(args.file, args.id, UploadImageTypeEnum.PROFILE);
        const profile = await this.profileRepository.findOne({ userId: args.id });
        // TODO: Not sure how to get an id here? Previously with S3 we could just get the Key but I don't think a similar value
        // exists in BlockBlobUploadResponse? I just return the file path now
        await this.profileRepository.patch(profile.id, { avatar });
    }
}
