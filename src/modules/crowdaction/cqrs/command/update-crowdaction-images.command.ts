import { Inject, Injectable } from '@nestjs/common';
import { ICommand } from '@common/cqrs';
import { ICrowdActionRepository } from '@domain/crowdaction';
import { IS3Client } from '@core/s3-client.interface';
import { S3Client } from '@modules/core/s3';
import { CardAndOrBannerMissingError, CrowdActionDoesNotExist } from '@modules/crowdaction/errors';
import { UploadImageTypeEnum } from '@modules/core/s3/enum';

interface UpdateCrowdActionImagesArgs {
    id: string;
    card?: any;
    banner?: any;
}

@Injectable()
export class UpdateCrowdActionImagesCommand implements ICommand {
    constructor(@Inject(S3Client) private readonly s3Client: IS3Client, private readonly crowdActionRepository: ICrowdActionRepository) {}

    async execute({ id, card, banner }: UpdateCrowdActionImagesArgs): Promise<void> {
        if (card === undefined && banner === undefined) {
            throw new CardAndOrBannerMissingError();
        }

        const [crowdAction] = await this.crowdActionRepository.findAll({ id });
        if (!crowdAction) {
            throw new CrowdActionDoesNotExist();
        }

        const images = { card: crowdAction.images.card, banner: crowdAction.images.banner };
        if (card && card.length) {
            const cardPath = await this.s3Client.upload(card[0], id, UploadImageTypeEnum.CROWDACTION_CARD);
            images.card = cardPath;
        }

        if (banner && banner.length) {
            const bannerPath = await this.s3Client.upload(banner[0], id, UploadImageTypeEnum.CROWDACTION_BANNER);
            images.banner = bannerPath;
        }

        await this.crowdActionRepository.patch(id, { images });
    }
}
