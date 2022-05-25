import { AuthenticationError } from '../errors';

export function getTokenFromRequestHeader(token: string): string {
    const matches: RegExpMatchArray | null = /Bearer\s(\S+)/.exec(token);

    if (!matches) {
        throw new AuthenticationError('Authorization header is malformed');
    }

    return matches[1];
}
