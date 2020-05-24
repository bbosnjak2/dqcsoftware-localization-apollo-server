import express from 'express';
import {availableTranslations} from 'src/localization/generated/AvailableTranslations';
import {ITranslation} from 'src/localization/generated/ITranslation';
import {ResolverData} from 'type-graphql';
import {Container} from 'typedi';

export const translationManager = {
    getDefaultTranslation: (): ITranslation => {
        return availableTranslations.find((translation) => translation.isDefault)!.instance();
    },

    // Get the ITranslation instance corresponding to the x-response-location header.
    // Returns the default translation as the final fallback.  For use by app.use() in
    // the entry point index.ts
    getTranslationFromRequestHeader: (req: express.Request): ITranslation => {
        const requestedIsoCode = req.headers['x-response-localization']?.toString().toLowerCase().trim();

        let requestedTranslationInstance: ITranslation | undefined;

        // try to find an exact match
        if (requestedIsoCode) {
            requestedTranslationInstance = availableTranslations
                .find((translation) => translation.isoCode.toLowerCase() === requestedIsoCode)
                ?.instance();
        }

        // if no exact match and it's a regional code, try the national code instead
        if (!requestedTranslationInstance && requestedIsoCode?.includes('-')) {
            const nationalIsoCodeOfRequestedIsoCode = requestedIsoCode.split('-')[0];

            requestedTranslationInstance = availableTranslations
                .find((translation) => translation.isoCode.toLowerCase() === nationalIsoCodeOfRequestedIsoCode)
                ?.instance();
        }

        // fallback to the default translation if the requested localization can't be
        // honoured
        return requestedTranslationInstance ?? translationManager.getDefaultTranslation();
    },

    // Gets a scoped container factory that injects the request's ITranslation instance into the container.
    // For use by the createSchema call in the entry point index.ts.
    requestContainerFactory: ({context}: ResolverData<any>) => {
        // https://typegraphql.com/docs/dependency-injection.html
        // https://github.com/MichalLytek/type-graphql/tree/master/examples/using-scoped-container

        const requestContainer = Container.of(context.requestId);

        requestContainer.set([
            {
                id: 'ITranslation',
                value: translationManager.getTranslationFromRequestHeader(context.req),
            },
        ]);

        return requestContainer;
    },
};
