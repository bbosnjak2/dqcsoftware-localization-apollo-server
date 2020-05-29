import {ITranslation} from './ITranslation';

export const enCA = (): ITranslation => ({
    translation: {
        name: 'default translation',
    },
    common: {
        ok: 'OK',
        cancel: 'Cancel',
        errors: {
            unknownError: 'An error has occurred.',
        },
    },
});
