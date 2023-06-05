import { Post } from "@domain/post";
import { IPostRepository, QueryPost } from "@domain/post/interface/post-repository.interface";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostDocument, PostPersistence } from "../persistence/post.persistence";
import { Model } from "mongoose";
import { toMongoQuery } from "../utils/mongo.utils";
import { FindCriteria, IPagination } from "@core/repository.interface";

@Injectable()
export class PostRepsotory implements IPostRepository {
    constructor(@InjectModel(PostPersistence.name) private readonly documentModel: Model<PostDocument>) {}

    async findAll(query: FindCriteria<QueryPost>, options?: IPagination): Promise<Post[]> {
        const mongoQuery = toMongoQuery(query);
        const documents = await this.documentModel.find(mongoQuery, null, { skip: options?.offset, limit: options?.limit });
        return documents.map((doc) => Post.create(doc.toObject({ getters: true })));
    }
    create(): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    patch(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findOne(): Promise<Post> {
        throw new Error("Method not implemented.");
    }

}