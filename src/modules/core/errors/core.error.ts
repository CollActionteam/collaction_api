import { ApiError } from '@common/types';

export class CountryMustBeValidError extends ApiError {
    constructor(country: string) {
        super({ message: `Country ${country} is not valid` });
    }
}

export class FileTypeInvalidError extends ApiError {
    constructor(fileType: string, allowedFileTypes: string[]) {
        super({ message: `File type ${fileType} is not valid, must be one of ${allowedFileTypes.join(',')}` });
    }
}
