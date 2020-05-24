import {enCA} from './enCA';
import {frCA} from './frCA';
import {xx} from './xx';

import {ITranslation} from './ITranslation';

export interface IAvailableTranslation {
    nativeName: string;
    isoCode: string;
    countryCode: string;
    instance: () => ITranslation;
    isDefault?: boolean;
    isTest?: boolean;
}

export const availableTranslations: IAvailableTranslation[] = [
    {
        nativeName: 'English',
        isoCode: 'en-CA',
        countryCode: 'ca',
        instance: enCA,
        isDefault: true,
    },
    {
        nativeName: 'Français',
        isoCode: 'fr-CA',
        countryCode: 'fr',
        instance: frCA,
        isDefault: false,
    },
    {
        nativeName: 'Test Translation',
        isoCode: 'xx',
        countryCode: '',
        instance: xx,
        isDefault: false,
        isTest: true,
    },
];
