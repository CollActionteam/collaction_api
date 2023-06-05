import { ICQRSHandler } from "@common/cqrs";
import { PaginationDto } from "@infrastructure/pagination";
import { ListPostsByThreadQuery } from "@modules/post/cqrs/query/list-posts-by-thread.query";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('v1/posts')
@ApiTags('Posts')
export class PostController {

    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Get(':threadId')
    async getPostsByThread(@Query() { page, pageSize }: PaginationDto,) {
        this.cqrsHandler.fetch(ListPostsByThreadQuery, {page, pageSize})
    }
}