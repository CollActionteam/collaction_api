import { HttpStatus } from '@nestjs/common';
import { ApiError } from '@common/types';

export class ParticipationRequiresCommitmentError extends ApiError {
    constructor() {
        super({ message: `Participating in a CrowdAction requires at least one Commitment`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class CrowdActionDeosNotExistError extends ApiError {
    constructor() {
        super({ message: `Cannot participate in a CrowdAction that does not exist`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class UserIsNotParticipatingError extends ApiError {
    constructor(crowdActionId: string) {
        super({ message: `User is not participating in CrowdAction ${crowdActionId}`, statusCode: HttpStatus.BAD_REQUEST });
    }
}

export class ParticipationHasInvalidCommitment extends ApiError {
    constructor(invalidOptions: string[]) {
        super({
            message: `Commitments (${invalidOptions.join(',')}) do not exist for this CrowdAction`,
            statusCode: HttpStatus.BAD_REQUEST,
        });
    }
}

export class UserHasNoParticipations extends ApiError {
    constructor() {
        super({ message: `User has no participations`, statusCode: HttpStatus.NOT_FOUND });
    }
}
