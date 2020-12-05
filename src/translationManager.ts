import {IAvailableTranslation} from 'dqcsoftware-localization-common/lib/interfaces/IAvailableTranslation';
import express from 'express';
import {ResolverData} from 'type-graphql';
import {Container} from 'typedi';

export class TranslationManager<T> {
    public static instance: TranslationManager<any>;

    constructor(readonly availableTranslations: IAvailableTranslation<T>[]) {}

    public getDefaultTranslation = (): T => {
        return this.availableTranslations.find((translation) => translation.isDefault)!.instance();
    };

    // Get the ITranslation instance corresponding to the x-response-location header.
    // Returns the default translation as the final fallback.  For use by app.use() in
    // the entry point index.ts
    public getTranslationFromRequestHeader = (req: express.Request): T => {
        const requestedIsoCode = req.headers['x-response-localization']?.toString().toLowerCase().trim();

        let requestedTranslationInstance: T | undefined;

        // try to find an exact match
        if (requestedIsoCode) {
            requestedTranslationInstance = this.availableTranslations
                .find((translation) => translation.isoCode.toLowerCase() === requestedIsoCode)
                ?.instance();
        }

        // if no exact match and it's a regional code, try the national code instead
        if (!requestedTranslationInstance && requestedIsoCode?.includes('-')) {
            const nationalIsoCodeOfRequestedIsoCode = requestedIsoCode.split('-')[0];

            requestedTranslationInstance = this.availableTranslations
                .find((translation) => translation.isoCode.toLowerCase() === nationalIsoCodeOfRequestedIsoCode)
                ?.instance();
        }

        // fallback to the default translation if the requested localization can't be
        // honoured
        return requestedTranslationInstance ?? this.getDefaultTranslation();
    };

    // Gets a scoped container factory that injects the request's ITranslation instance into the container.
    // For use by the createSchema call in the entry point index.ts.
    public requestContainerFactory = ({context}: ResolverData<any>) => {
        // https://typegraphql.com/docs/dependency-injection.html
        // https://github.com/MichalLytek/type-graphql/tree/master/examples/using-scoped-container

        const requestContainer = Container.of(context.requestId);

        requestContainer.set([
            {
                id: 'ITranslation',
                value: this.getTranslationFromRequestHeader(context.req),
            },
        ]);

        return requestContainer;
    };
}
