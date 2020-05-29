import express from 'express';
import * as faker from 'faker';
import {translationManager} from 'translationManager';
import {availableTranslations} from '../localization/generated/AvailableTranslations';
import {ITranslation} from '../localization/generated/ITranslation';

describe('translationManager', () => {
    const createHeaders = (localizationValue: string): {[key: string]: string} => {
        const headers: {[key: string]: string} = {};

        headers['x-response-localization'] = localizationValue;

        return headers;
    };

    beforeEach(() => {
        availableTranslations[0].isDefault = true; // en-CA
        availableTranslations[1].isDefault = false; // en-FR
    });

    describe('getDefaultTranslation', () => {
        it('should return the default translation', () => {
            availableTranslations[0].isDefault = false;
            availableTranslations[1].isDefault = true;

            const actualDefaultTranslation = translationManager.getDefaultTranslation();

            expect(actualDefaultTranslation).toBeDefined();
            expect(actualDefaultTranslation.translation.name).toBe('Canadian French translation');
        });
    });

    describe('getTranslationFromRequestHeader', () => {
        it('should return the default translation if header is missing', () => {
            const mockRequest: express.Request = ({headers: []} as any) as express.Request;

            const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

            expect(actualTranslation).toBeDefined();
            expect(actualTranslation.translation.name).toBe('default translation');
        });

        it('should return the default translation if header is blank', () => {
            const mockRequest: express.Request = ({
                headers: createHeaders(''),
            } as any) as express.Request;

            const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

            expect(actualTranslation).toBeDefined();
            expect(actualTranslation.translation.name).toBe('default translation');
        });

        it('should return the default translation if header is unrecognized', () => {
            const mockRequest: express.Request = ({
                headers: createHeaders(faker.random.alphaNumeric(5)),
            } as any) as express.Request;

            const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

            expect(actualTranslation).toBeDefined();
            expect(actualTranslation.translation.name).toBe('default translation');
        });

        it('should return the correct translation for en-CA', () => {
            const mockRequest: express.Request = ({
                headers: createHeaders('en-CA'),
            } as any) as express.Request;

            const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

            expect(actualTranslation).toBeDefined();
            expect(actualTranslation.translation.name).toBe('default translation');
        });

        describe('when non-default translation requested', () => {
            it('should return the correct translation for exact match', () => {
                const mockRequest: express.Request = ({
                    headers: createHeaders('fr-CA'),
                } as any) as express.Request;

                const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

                expect(actualTranslation).toBeDefined();
                expect(actualTranslation.translation.name).toBe('Canadian French translation');
            });

            it('should return the correct translation for different casing', () => {
                const mockRequest: express.Request = ({
                    headers: createHeaders('FR-ca'),
                } as any) as express.Request;

                const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

                expect(actualTranslation).toBeDefined();
                expect(actualTranslation.translation.name).toBe('Canadian French translation');
            });

            it('should return the existing national translation for non-existent regional translation', () => {
                const mockRequest: express.Request = ({
                    headers: createHeaders('xx-ca'),
                } as any) as express.Request;

                const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

                expect(actualTranslation).toBeDefined();
                expect(actualTranslation.translation.name).toBe('{Test translation}');
            });

            it('should return the default translation for non-existent regional translation with non-existent national translation', () => {
                const mockRequest: express.Request = ({
                    headers: createHeaders('zz-zz'),
                } as any) as express.Request;

                const actualTranslation = translationManager.getTranslationFromRequestHeader(mockRequest);

                expect(actualTranslation).toBeDefined();
                expect(actualTranslation.translation.name).toBe('default translation');
            });
        });
    });

    describe('requestContainerFactory', () => {
        const createArgs = (options: {headerValue: string; requestId: string}) => {
            return {
                context: {
                    req: {headers: createHeaders(options.headerValue)},
                    requestId: options.requestId,
                },
            } as any;
        };

        it('should return a container for the request ID', () => {
            const expectedRequestId = faker.random.alphaNumeric(10);
            const actualContainer = translationManager.requestContainerFactory(
                createArgs({
                    headerValue: '',
                    requestId: expectedRequestId,
                }),
            );

            expect(actualContainer).toBeDefined();
            expect(actualContainer.id).toBe(expectedRequestId);
        });

        it('should return a container that provides the requested translation', () => {
            const actualContainer = translationManager.requestContainerFactory(
                createArgs({
                    headerValue: 'xx',
                    requestId: faker.random.alphaNumeric(10),
                }),
            );

            expect(actualContainer).toBeDefined();

            const actualTranslation = actualContainer.get<ITranslation>('ITranslation');

            expect(actualTranslation).toBeDefined();
            expect(actualTranslation.translation.name).toBe('{Test translation}');
        });
    });
});
