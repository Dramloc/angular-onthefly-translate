angular.module('app.translations', [
    'ngSanitize',
    'pascalprecht.translate'
]).config(translationConfiguration);

/** @ngInject */
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
}