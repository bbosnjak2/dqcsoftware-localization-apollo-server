import {ITranslation} from './ITranslation';

export const frCA = (): ITranslation => ({
    translation: {
        name: 'Canadian French translation',
    },
    common: {
        ok: 'Soumettrez',
        cancel: 'Annuler',
        errors: {
            unknownError: 'An error has occurred.',
        },
    },
});
