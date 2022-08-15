import { Injectable } from "@nestjs/common";
import { CommitmentOption, ICommitmentOptionRepository } from "@domain/commitmentoption";

@Injectable()
export class commitmentoptionService {
    constructor(private readonly commitmentOptionRepository: ICommitmentOptionRepository) {}

    async findByIdOrFail(id: string): Promise<CommitmentOption> {
        return this.commitmentOptionRepository.findOne({ id });
    }
}
