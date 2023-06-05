import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('v1/posts')
@ApiTags('Posts')
export class PostController {

    @Get(':threadId')
    async getPostsByThread() {
        return 'posts'
    }
}