import { ICQRSHandler } from "@common/cqrs";
import { PaginationDto } from "@infrastructure/pagination";
import { ListPostsByThreadQuery } from "@modules/post/cqrs/query/list-posts-by-thread.query";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller('v1/posts')
@ApiTags('Posts')
export class PostController {

    constructor(private readonly cqrsHandler: ICQRSHandler) {}

    @Get(':threadId')
    async getPostsByThread(@Param('threadId') threadId: string, @Query() { page, pageSize }: PaginationDto,) {
        const foundPosts = await this.cqrsHandler.fetch(ListPostsByThreadQuery, {page, pageSize, filter: {threadId}})
        return { pageInfo: foundPosts.pageInfo, items: foundPosts.items };
    }
}