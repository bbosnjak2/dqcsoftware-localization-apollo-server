# Release Process

-   Create a version branch
-   Update `package.json` with the expected version (use semantic versioning)
-   Develop and test the new version

To prepare the release, execute the following set of commands:

    rmdir /s /q lib
    del *.tgz
    npm run build
    npm run lint
    npm run format
    npm run test

To package the release, execute the following:

    npm pack

Test the `tgz` in another app using

    `npm install --save-dev <package>.tgz`

Once verified:

-   Add the `tgz` to git and commit
-   Merge to `develop`
