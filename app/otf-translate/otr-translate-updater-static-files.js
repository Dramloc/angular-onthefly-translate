angular.module('otf-translate')
  .factory('$translateStaticFilesUpdater', $translateStaticFilesUpdater);

/* @ngInject */
function $translateStaticFilesUpdater($q, $http, $translate) {
    return function (options) {
      var promises = [];

      if (undefined === options.files) {
        options.files = [{
          prefix: options.prefix,
          suffix: options.suffix
        }];
      }

      angular.forEach(options.files, function (file) {
        promises.push(put(options, file));
      });

      return $q.all(promises);
    }

    function put(options, file) {
      var locale = $translate.resolveClientLocale();
      var data = {};
      data[options.key] = options.value;
      return $http(
        angular.extend({
          url: [file.prefix, locale, file.suffix].join(''),
          data: data,
          method: 'PUT'
        }, options.$http))
        .then(function () {
          return $q.resolve();
        }, function () {
          return $q.reject();
        });
    }
}