import { IBadgeConfig } from '../interface/badge-config.interface';

export class BadgeConfig implements IBadgeConfig {
    constructor(config: IBadgeConfig) {
        this.diamondTreshold = config.diamondTreshold;
    }

    readonly diamondTreshold: number;
}
