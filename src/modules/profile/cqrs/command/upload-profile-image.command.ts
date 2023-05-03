import { Inject, Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { IProfileRepository } from '@domain/profile';
import { BlobClientService, UploadImageTypeEnum } from '@modules/core';

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
        await this.profileRepository.patch(profile.id, { avatar });
    }
}
