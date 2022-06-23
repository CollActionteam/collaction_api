import { ApiError } from '@common/types';

export class CommitmentOptionDoesNotExistError extends ApiError {
    constructor(id: string) {
        super({ message: `CommitmentOption with ID (${id}) does not exist!` });
    }
}
