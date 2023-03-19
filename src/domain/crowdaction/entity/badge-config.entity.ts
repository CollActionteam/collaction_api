import { IBadgeConfig } from '../interface/badge-config.interface';

export class BadgeConfig implements IBadgeConfig {
    constructor(config: IBadgeConfig) {
        this.diamondThreshold = config.diamondThreshold;
    }

    readonly diamondThreshold: number;
}
