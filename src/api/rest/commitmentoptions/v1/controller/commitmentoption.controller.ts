import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/commitmentoptions')
@ApiTags('CommitmentOption')
export class CommitmentOptionController {
    @Get()
    sayHi(): string {
        return 'Hello World!';
    }
}
