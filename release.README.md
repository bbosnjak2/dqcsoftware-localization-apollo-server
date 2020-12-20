# Release Process

-   Create a version branch
-   Update `package.json` with the expected version (use semantic versioning)
-   Develop and test the new version

To prepare the release, execute the following set of commands:

    rmdir /s /q lib
    del *.tgz
    npm run format
    npm run lint
    npm run test
    npm run build

To package the release, execute the following:

    npm pack

To publish the package, execute the following:

    npm publish --registry https://npm.pkg.jetbrains.space/dqcsoftware/p/dqc-localization/dqcsoftware-localization-npm/

Install/test in another app using

    npm install --save dqcsoftware-localization-apollo-server@latest --registry https://npm.pkg.jetbrains.space/dqcsoftware/p/dqc-localization/dqcsoftware-localization-npm/

Once verified:

-   Merge to `develop`
