angular
    .module('onTheFlyTranslation', [
        'pascalprecht.translate'
    ])
    .decorator('$translateStaticFilesLoader', translateStaticFilesLoaderDecorator)
    .decorator('translateDirective', translateDirectiveDecorator)
    .factory('otfTranslationOptions', otfTranslationOptions);

/* @ngInject */
function otfTranslationOptions() {
    return {
        $loaderEnabled: false,
        dataBuilder: function (key, value, options, file) {
            return {
                key: key,
                value: value
            };
        },
        urlBuilder: function (key, value, options, file) {
            return [file.prefix + options.key + file.suffix].join('');
        }
    };
}

/* @ngInject */
function translateDirectiveDecorator($delegate, $http, $q, $translate, $log, otfTranslationOptions) {
    var delegate = $delegate[0];
    var delegateCompile = delegate.compile;

    delegate.compile = compile;
    return $delegate;

    function compile(element, attrs) {
        var delegateLink = delegateCompile(element, attrs);
        return function (scope, element, attrs) {
            var input = angular.element('<input/>');
            var key = attrs['translate'];
            if ('' === key || undefined === key) {
                key = element.text();
            }

            scope.$watch(function () {
                return element.text();
            }, function () {
                input.val(element.text());
            });

            input.bind('blur', function () {
                updateTranslation(key, input.val());
            });

            input.insertAfter(element);
            delegateLink(scope, element, attrs);
        }
    }

    /**
     * Update translation with given key with its new value.
     * @param {string} key - translation key
     * @param {string} value - new translation value
     */
    function updateTranslation(key, value) {
        var loaderOptions = getLoaderOptions();
        var promises = [];
        angular.forEach(loaderOptions.files, function (file) {
            promises.push(put(key, value, loaderOptions, file));
        });

        return $q.all(promises)
            .then(function () {
                return $translate.refresh(loaderOptions.key);
            })
            .catch(function (response) {
                $log.error('Failed to update translations', loaderOptions.key);
            });
    }

    /**
     * Execute http request to update translation with given key.
     */
    function put(key, value, loaderOptions, file) {
        return $http(
            angular.extend({
                url: loaderOptions.urlBuilder(key, value, loaderOptions, file),
                data: loaderOptions.dataBuilder(key, value, loaderOptions, file),
                method: 'PUT'
            }, loaderOptions.$http))
            .then(function (result) {
                return result.data;
            })
            .catch(function () {
                return $q.reject();
            });
    }

    /**
     * Get current loader options.
     * @return {Object} - loader options
     */
    function getLoaderOptions() {
        var options = angular.extend({}, otfTranslationOptions);
        if (undefined === options.files) {
            options.files = [{
                prefix: options.prefix,
                suffix: options.suffix
            }];
        }
        return options;
    }
}

/* @ngInject */
function translateStaticFilesLoaderDecorator($delegate, otfTranslationOptions) {
    return function (options) {
        angular.extend(otfTranslationOptions, options);
        otfTranslationOptions.$loaderEnabled = true;
        return $delegate(options);
    };
}