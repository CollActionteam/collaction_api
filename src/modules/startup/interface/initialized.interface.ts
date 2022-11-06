import { OnModuleInit } from '@nestjs/common';

export abstract class Initialized implements OnModuleInit {
    onModuleInit(): void {
        this.init();
    }

    abstract init(): Promise<void> | void;
}
