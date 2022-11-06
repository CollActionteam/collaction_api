import { SchedulerService } from '@modules/scheduler';
import { Injectable } from '@nestjs/common';
import { Initialized } from '../interface';

@Injectable()
export class StartupService extends Initialized {
    constructor(private readonly schedulerService: SchedulerService) {
        super();
    }

    init() {
        console.log('The Startup module has been initialized.');
        this.schedulerService.scheduleTasks();
    }
}
