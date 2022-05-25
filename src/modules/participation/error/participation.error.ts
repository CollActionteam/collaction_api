import { ApiError } from '@common/types';

export class ParticipationRequiresCommitmentError extends ApiError {
    constructor() {
        super({ message: `Participating in a CrowdAction requires at least one Commitment` });
    }
}

export class CrowdActionDeosNotExistError extends ApiError {
    constructor() {
        super({ message: `Cannot participate in a CrowdAction that does not exist` });
    }
}
