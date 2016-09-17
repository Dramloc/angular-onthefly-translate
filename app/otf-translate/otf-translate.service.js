angular
  .module('otf-translate')
  .provider('$otfTranslate', $otfTranslateProvider);

/* @ngInject */
function $otfTranslateProvider() {
  var $updaterFactory = undefined;
  var $updaterOptions = undefined;

  this.useUpdater = function (updaterFactory, updaterOptions) {
    // TODO: control input
    $updaterFactory = updaterFactory;
    $updaterOptions = updaterOptions;
  };

  this.$get = ['$translate',
    '$injector',
    '$log',
    function ($translate, $injector, $log) {
      var service = {
        update: update,
        getUninterpolatedValue: getUninterpolatedValue
      };
      return service;

      function update(key, value) {
        if (undefined === $updaterFactory) {
          return;
        }
        var options = angular.extend({
          key: key,
          value: value
        }, $updaterOptions);

        return $injector.get($updaterFactory)(options).then(function () {
          return $translate.refresh($translate.resolveClientLocale());
        }, function (response) {
          $log.error('Failed to update translations', response);
        });
      }

      function getUninterpolatedValue(key) {
        return $translate(key, undefined, '$otfInterpolator');
      }
    }];
}