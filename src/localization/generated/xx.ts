import {ITranslation} from './ITranslation';

export const xx = (): ITranslation => ({
    translation: {
        name: '{Test translation}',
    },
    common: {
        ok: '{OK}',
        cancel: '{Cancel}',
        errors: {
            unknownError: '{An error has occurred.}',
        },
    },
});
