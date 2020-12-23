# DreamQuest Canada Localization Support for Apollo Server

This package provides the `translationManager` to support Apollo Server and
`type-graphql` (in conjunction with `typedi`).

Installation:

    npm install --save @dqcsoftware-localization/apollo-server@latest

## NOTE

Because this package assumes the translation files are located in the `src/localization/generated`
folder.

It also assumes the following entry exists in the `tsconfig.json` file:

    "baseUrl": "./src",

If the `baseUrl` is incorrect, errors will occur indicating the `translationManager.js` module
cannot locate the `localization/generated/AvailableTranslations` module.

## Wire Up

### Dependency Injection

In order to register a scoped container with the current request's ITranslation,
modify the Type-GraphQL `createSchema` call in `index.ts` to be:

    const schema = await createSchema(
        translationManager.requestContainerFactory,
    );

### Request Header Processing

Add the following code to the index.ts file to extract the requested localization
from the request headers:

    app.use(
        async (
            req: IRequestPlus,
            _res: express.Response,
            next: NextFunction,
        ) => {
            processRequestedLocalization(req);

            return next();
        },
    );

The `processRequestedLocalization` method looks for the `x-response-localization` header
and adds the corresponding ITranslation instance to the request.

If there is no header or the requested localization isn't supported, the default translation
is used instead.

In the case of an unsupported regional translation (e.g. en-GB), the national variant is used
if available (e.g. en), otherwise it falls back to the default translation.

## Type Injection

The instance of ITranslation applicable to the current request can then be injected into
services as shown in the example below:

    @Service({
        factory: () =>
            new MyService(
                Container.get<ITranslation>('ITranslation'),
            ),
    })
    export class MyService {
        constructor(
            private readonly lc: ITranslation,
        ) {
        }

        public aMethod = () => ({
            const translatedLabel = this.lc.fields.emailAddress;
        });
    }

# Release Notes

## 1.0.4

- changed to scoped packages
- renamed package to @dqcsoftware-localization/apollo-server
- some cleanups

## 1.0.3

- deploy built NPM package to DQC Software Jetbrains Space private NPM repo

