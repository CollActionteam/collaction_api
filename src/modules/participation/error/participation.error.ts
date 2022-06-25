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

export class UserIsNotParticipatingError extends ApiError {
    constructor(crowdActionId: string) {
        super({ message: `User is not participating in CrowdAction ${crowdActionId}` });
    }
}

export class ParticipationHasInvalidCommitmentOption extends ApiError {
    constructor(invalidOptions: string[]) {
        super({ message: `CommitmentOptions (${invalidOptions.join(',')}) do not exist for this CrowdAction` });
    }
}
