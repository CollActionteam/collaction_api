import { Post } from "@domain/post";
import { IPostRepository } from "@domain/post/interface/post-repository.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostRepsotory implements IPostRepository {
    findAll(): Promise<Post[]> {
        throw new Error("Method not implemented.");
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