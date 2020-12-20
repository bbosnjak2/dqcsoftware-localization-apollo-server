import {IAvailableTranslation} from 'dqcsoftware-localization-apollo-server-common/lib/interfaces/IAvailableTranslation';
import {ITranslation} from 'localization/generated/ITranslation';
import {enCA} from './enCA';
import {frCA} from './frCA';
import {xx} from './xx';

export const availableTranslations: IAvailableTranslation<ITranslation>[] = [
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
