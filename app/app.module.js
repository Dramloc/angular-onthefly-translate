angular.module('app', [
  'ngSanitize',
  'pascalprecht.translate',
  'otf-translate'
])
.config(translationConfiguration)
.config(otfTranslationConfiguration);

/* @ngInject */
function translationConfiguration($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/i18n/',
    suffix: ''
  });
  $translateProvider.preferredLanguage('en');

  $translateProvider.fallbackLanguage(['en'])
    .uniformLanguageTag('bcp47')
    .determinePreferredLanguage();

  $translateProvider.useSanitizeValueStrategy('sanitize');

  $translateProvider.addInterpolation('$otfInterpolator');
}

/* @ngInject */
function otfTranslationConfiguration($otfTranslateProvider) {
  $otfTranslateProvider.useUpdater('$translateStaticFilesUpdater', {
    prefix: '/i18n/',
    suffix: ''
  });
}