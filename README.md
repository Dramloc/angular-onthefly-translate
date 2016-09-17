# angular-onthefly-translate

Angular on-the-fly translation module.
This module can be used to dynamically update translations served from your backend using angular-translate loaders.

This module is a work in progress and currently only handle translate directive (filters will come later, service might be a pain).

## Usage

Add `'otf-translate'` to your module dependencies.

Configure an updater to use in your app configuration.

```javascript
app.config(otfTranslationConfiguration);

otfTranslationConfiguration.$inject = ['$otfTranslateProvider'];
function otfTranslationConfiguration($otfTranslateProvider) {
  $otfTranslateProvider.useUpdater('$translateStaticFilesUpdater', {
    prefix: '/i18n/',
    suffix: ''
  });
}
```

Updater could be used to PUT the modified translation to your backend.
Default `$translateStaticFilesUpdater` factory could be used with `$translateStaticFilesLoader`.
Other updaters matching angular-translate loaders will be added.
