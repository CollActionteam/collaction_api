import { IBadgeConfig } from '../interface';

export class BadgeConfig implements IBadgeConfig {
    constructor(config: IBadgeConfig) {
        this.diamondThreshold = config.diamondThreshold;
    }

    readonly diamondThreshold: number | IBadgeConfig;
}
