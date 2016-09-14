angular.module('app.translations', [
    'ngSanitize',
    'pascalprecht.translate'
]).config(translationConfiguration);

/** @ngInject */
function translationConfiguration($translateProvider) {
    // We don't really know where translation is from
    // decorate static files loader to add information?
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